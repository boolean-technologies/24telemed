import requests
from django.conf import settings
from django.template.loader import render_to_string

class Notification:
    def __init__(self):
        self.api_key = settings.MAILGUN_API_KEY
        self.domain = settings.MAILGUN_DOMAIN
        self.email_from = settings.EMAIL_FROM

    def send_email(self, to, subject, template_name, context):
        template = render_to_string(template_name, context)
        return self._send_mailgun_email(to, subject, template)

    def _send_mailgun_email(self, to, subject, html_content):
        return requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", self.api_key),
            data={
                "from": self.email_from,
                "to": to,
                "subject": subject,
                "html": html_content,
            }
        )

    def send_password_reset(self, to, reset_link):
        subject = "Password Reset Request"
        template_name = 'emails/password_reset.html'
        context = {'reset_link': reset_link}
        return self.send_email(to, subject, template_name, context)

    def send_otp_notification(self, to, otp_code):
        subject = "Your OTP Code"
        template_name = 'emails/otp_notification.html'
        context = {'otp_code': otp_code}
        return self.send_email(to, subject, template_name, context)

    def send_welcome_notification(self, to, username):
        subject = "Welcome to Our Service"
        template_name = 'emails/welcome_notification.html'
        context = {'username': username}
        return self.send_email(to, subject, template_name, context)
