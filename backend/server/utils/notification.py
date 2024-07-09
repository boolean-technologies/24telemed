from django.core.mail import send_mail
from users.models import User
from typing import Literal
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings
from datetime import datetime

EmailType = Literal[
    'forget_password_otp', 
]

class Notification:
    def __init__(self, user: User, emailType: EmailType):
        """
        Initialize the EmailNotification object with a user.
        
        :param user: User object representing the email recipient.
        """
        self.emailType = emailType
        self.user = user
        self.subject = ""
        self.message = ""
        self.data = {
            "date": datetime.now().strftime('%d %b, %Y'),
            "name": self.user.first_name
        }
        self.template_id = None
        
    def send(self, *args, **kwargs):
        """
        Send an email based on the emailType by calling the appropriate function.
        """
        email_functions = {
            'forget_password_otp': self.send_otp_notification,
        }

        # Check if emailType is valid
        if self.emailType not in email_functions:
            raise ValueError(f"Invalid emailType: {self.emailType}")

        # Call the appropriate function based on emailType
        email_functions[self.emailType](*args, **kwargs)

        # After setting the subject and message, call the private __send method to send the email.
        if (self.__send()):
            print("Notification sent!")
        else:
            print("Notification NOT sent!")

        
    def __send(self):
        try:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            message = Mail(
                from_email=settings.EMAIL_FROM,
                to_emails=self.user.email
            )
            message.dynamic_template_data = self.data
            message.template_id = self.template_id
            
            response = sg.send(message)
            if response.status_code == 202:
                return True
            else:
                return False
        except Exception as e:
            print("Error sending email: ", e)
            return False
    
    def __add_mail_data(self, data):
        self.data = {
            **self.data,
            **data,
        }

    def send_otp_notification(self, otp: str):
        self.template_id = settings.SENDGRID_TEMPLATE_ID_PASSWORD_RESET_OTP
        self.__add_mail_data({ "otp": otp })