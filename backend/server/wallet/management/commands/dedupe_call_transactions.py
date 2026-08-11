import re

from django.core.management.base import BaseCommand
from django.db import transaction as db_transaction

from call_log.models import CallLog
from wallet.models import Transaction

# Matches the exact description sessionEnded() writes: 'Call session with
# Dr. <first_name> (<doctor.user_id>)'. The doctor's user_id in parens is the
# only stable identifier in the text — first_name alone isn't unique enough.
DESCRIPTION_RE = re.compile(r'^Call session with Dr\. .+\(([^)]+)\)$')


class Command(BaseCommand):
    help = (
        "One-off cleanup for the sessionEnded() double-billing bug (fixed "
        "elsewhere in this change): before the fix, a redelivered/retried "
        "VideoSDK webhook created a fresh withdrawal Transaction every time, "
        "even though the call had already been billed. This command finds, "
        "for each wallet, groups of 'Call session with Dr. X' withdrawals "
        "and compares the count against how many of that doctor's CallLogs "
        "are actually marked Completed for that patient. Any excess beyond "
        "that count is deleted (oldest kept) and refunded to the wallet. "
        "Dry-run by default — pass --apply to actually make changes."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--apply',
            action='store_true',
            help='Actually delete duplicates and refund wallets. Omit for a dry-run report only.',
        )
        parser.add_argument(
            '--username',
            help='Only process the wallet belonging to this username, leave every other wallet untouched.',
        )

    def handle(self, *args, **options):
        apply_changes = options['apply']
        username = options.get('username')
        total_deleted = 0
        total_refund = 0.0

        withdrawals = (
            Transaction.objects.filter(
                transaction_type='withdrawal',
                description__startswith='Call session with Dr.',
            )
            .select_related('wallet', 'wallet__user')
            .order_by('wallet_id', 'created_at')
        )
        if username:
            withdrawals = withdrawals.filter(wallet__user__username=username)

        groups = {}
        for txn in withdrawals:
            match = DESCRIPTION_RE.match(txn.description or '')
            doctor_user_id = match.group(1) if match else None
            if not doctor_user_id:
                self.stdout.write(self.style.WARNING(
                    f"Skipping transaction {txn.id} — description doesn't match "
                    f"the expected pattern: {txn.description!r}"
                ))
                continue
            groups.setdefault((txn.wallet_id, doctor_user_id), []).append(txn)

        for (wallet_id, doctor_user_id), txns in groups.items():
            wallet = txns[0].wallet
            expected = CallLog.objects.filter(
                health_care_assistant=wallet.user,
                doctor__user_id=doctor_user_id,
                status='Completed',
            ).count()
            actual = len(txns)

            if actual <= expected:
                continue

            # Transactions are already ordered oldest-first within each group
            # (see .order_by('wallet_id', 'created_at') above) — keep the
            # earliest `expected` and treat the rest as duplicates.
            duplicates = txns[expected:]
            refund = sum(t.amount or 0 for t in duplicates)

            self.stdout.write(
                f"Wallet {wallet.user.username} ({wallet_id}) / doctor {doctor_user_id}: "
                f"{actual} withdrawal(s) found, {expected} completed call(s) expected — "
                f"{len(duplicates)} duplicate(s) totalling ₦{refund:.0f}"
            )

            total_deleted += len(duplicates)
            total_refund += refund

            if apply_changes:
                with db_transaction.atomic():
                    for txn in duplicates:
                        txn.delete()
                    if refund > 0:
                        wallet.deposit(refund)

        self.stdout.write('')
        if total_deleted == 0:
            self.stdout.write(self.style.SUCCESS('No duplicates found.'))
            return

        verb = 'Removed' if apply_changes else 'Would remove'
        self.stdout.write(self.style.SUCCESS(
            f"{verb} {total_deleted} duplicate transaction(s), "
            f"refunding ₦{total_refund:.0f} total."
        ))
        if not apply_changes:
            self.stdout.write(self.style.WARNING(
                'This was a dry run — re-run with --apply to actually delete and refund.'
            ))
