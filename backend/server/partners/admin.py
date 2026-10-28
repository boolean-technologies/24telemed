from django.contrib import admin, messages

from . import services
from .models import Partner, PartnerConsultation, PartnerMembership, PartnerService
from .paystack import PaystackError


class PartnerServiceInline(admin.StackedInline):
    model = PartnerService
    extra = 0
    filter_horizontal = ('doctors',)
    fields = ('name', 'description', 'fee', 'currency', 'doctors', 'paystack_subaccount_code', 'is_active', 'sort_order')


@admin.register(Partner, site=admin.site)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'commission_percent', 'paystack_subaccount_code', 'is_active')
    list_editable = ('commission_percent', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('settlement_account_name', 'created_at', 'updated_at')
    inlines = [PartnerServiceInline]
    actions = ['sync_paystack_subaccount']
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'tagline', 'description', 'logo_url', 'contact_email', 'contact_phone', 'is_active')}),
        ('Payments', {'fields': (
            'commission_percent', 'paystack_fee_bearer', 'settlement_bank_code',
            'settlement_account_number', 'settlement_account_name', 'paystack_subaccount_code',
        )}),
        ('Doctors', {'fields': ('exclusive_doctors',)}),
        (None, {'fields': ('created_at', 'updated_at')}),
    )

    @admin.action(description='Create / sync Paystack subaccount')
    def sync_paystack_subaccount(self, request, queryset):
        for partner in queryset:
            try:
                services.provision_subaccount(partner)
            except (PaystackError, services.PartnerConfigError) as exc:
                self.message_user(request, f'{partner.name}: {exc}', messages.ERROR)
            else:
                self.message_user(
                    request,
                    f'{partner.name}: subaccount {partner.paystack_subaccount_code} '
                    f'({partner.settlement_account_name or "account name pending"}).',
                    messages.SUCCESS,
                )


@admin.register(PartnerMembership, site=admin.site)
class PartnerMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'partner', 'created_at')
    list_filter = ('partner',)
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    raw_id_fields = ('user',)


@admin.register(PartnerConsultation, site=admin.site)
class PartnerConsultationAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'user', 'service', 'amount', 'commission_amount', 'status', 'reference')
    list_filter = ('status', 'partner', 'service')
    search_fields = ('reference', 'user__username', 'user__email')
    raw_id_fields = ('user', 'patient')
    readonly_fields = (
        'partner', 'service', 'amount', 'currency', 'commission_percent', 'commission_amount',
        'subaccount_code', 'reference', 'paid_at', 'completed_at', 'payment_data', 'created_at',
    )
