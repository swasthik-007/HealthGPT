from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.message import EmailMessage
import base64

def send_email_with_pdf(user_email, pdf_bytes):
    creds = Credentials.from_authorized_user_file('token.json', ['https://www.googleapis.com/auth/gmail.send'])
    service = build('gmail', 'v1', credentials=creds)

    html_content = """
    <div style="font-family:Arial, sans-serif; padding:20px; background-color:#f9f9f9;">
      <div style="text-align:center; padding:10px; background-color:#00796b; color:white;">
        <h2>🩺 HealthGPT Personalized Report</h2>
      </div>
      
      <div style="margin-top:20px;">
        <p>Hi there 👋,</p>
        <p>Thank you for using <strong>HealthGPT</strong>!</p>
        <p>We’ve analyzed your report and attached a personalized summary to this email. Here's what you can expect:</p>
        <ul>
          <li>🌿 Health insights</li>
          <li>⚠️ Flagged values (if any)</li>
          <li>🍲 Natural remedies and lifestyle suggestions</li>
          <li>📘 Simplified explanations</li>
        </ul>
        <p style="margin-top:15px;">Make sure to consult a licensed medical professional for any further advice.</p>
      </div>

      <div style="margin-top:30px; padding:10px; background-color:#e0f2f1; text-align:center;">
        <p style="margin:5px;">🧠 Stay informed. Stay healthy.</p>
        <p style="margin:5px;">🚀 With care, <br/> <strong>HealthGPT Team</strong></p>
        <a href="https://healthgpt.ai" target="_blank" style="color:#00796b;">🌐 Visit our site</a>
      </div>
    </div>
    """

    message = EmailMessage()
    message.set_content("Your email client does not support HTML. Please view this email in a browser.")
    message.add_alternative(html_content, subtype='html')

    message['To'] = user_email
    message['From'] = "mohanty.swastik7008@gmail.com"
    message['Subject'] = "🌡️ Your HealthGPT AI Report is Ready!"

    message.add_attachment(pdf_bytes, maintype='application', subtype='pdf', filename='HealthGPT_Report.pdf')

    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    send_result = service.users().messages().send(userId="me", body={'raw': encoded_message}).execute()
    return send_result
