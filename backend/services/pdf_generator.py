from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, Frame, SimpleDocTemplate, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics import renderPDF
from io import BytesIO
import textwrap
import random
import math


def generate_pdf(data: dict) -> bytes:
    """Generate a professionally styled health report PDF."""
    buffer = BytesIO()
    width, height = A4
    c = canvas.Canvas(buffer, pagesize=A4)
    
    # Define colors with a health theme
    medical_blue = colors.HexColor("#0891B2")  # Primary blue for medical theme
    light_blue = colors.HexColor("#E0F2FE")    # Light blue background
    accent_green = colors.HexColor("#10B981")  # Teal green for health indicators
    warning_orange = colors.HexColor("#F97316") # Orange for warnings
    text_dark = colors.HexColor("#1E293B")     # Dark text
    text_gray = colors.HexColor("#64748B")     # Secondary text
    white = colors.HexColor("#FFFFFF")         # White
    
    # Draw light blue background with a gradient effect
    c.setFillColor(light_blue)
    c.rect(0, 0, width, height, fill=1)
    
    # Add subtle health pattern (heartbeat line across the top)
    c.setStrokeColor(medical_blue)
    c.setLineWidth(1)
    y_pos = height - 15
    x_pos = 0
    while x_pos < width:
        c.line(x_pos, y_pos, x_pos + 5, y_pos)
        x_pos += 5
        c.line(x_pos, y_pos, x_pos + 2, y_pos - 10)
        x_pos += 2
        c.line(x_pos, y_pos - 10, x_pos + 2, y_pos + 10)
        x_pos += 2
        c.line(x_pos, y_pos + 10, x_pos + 2, y_pos - 5)
        x_pos += 2
        c.line(x_pos, y_pos - 5, x_pos + 5, y_pos)
        x_pos += 15
    
    # Medical cross in the top corner
    c.setFillColor(medical_blue)
    cross_size = 30
    cross_x = width - 60
    cross_y = height - 60
    cross_thickness = 10
    
    # Vertical bar of cross
    c.rect(cross_x - cross_thickness/2, 
           cross_y - cross_size/2,
           cross_thickness, 
           cross_size, fill=1)
    
    # Horizontal bar of cross
    c.rect(cross_x - cross_size/2,
           cross_y - cross_thickness/2,
           cross_size,
           cross_thickness, fill=1)
    
    # Header
    c.setFillColor(medical_blue)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 80, "🩺 HealthGPT Personalized Report")
    
    c.setFillColor(text_gray)
    c.setFont("Helvetica", 14)
    c.drawString(50, height - 100, "Evidence-based health analysis and recommendations")
    
    # Patient info card
    card_y = height - 150
    card_height = 50
    c.setFillColor(white)
    c.roundRect(50, card_y - card_height, 300, card_height, 8, fill=1, stroke=0)
    
    # Add subtle medical icon/border to the card
    c.setStrokeColor(medical_blue)
    c.setLineWidth(1.5)
    c.roundRect(50, card_y - card_height, 300, card_height, 8, fill=0, stroke=1)
    
    # Patient info text
    c.setFillColor(text_dark)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(60, card_y - 20, f"Patient: {data.get('patient_name', 'Patient')}")
    c.setFillColor(text_gray)
    c.setFont("Helvetica", 11)
    c.drawString(60, card_y - 38, f"ID: {data.get('id', 'UNKNOWN')} | Date: {data.get('date', '2025.05.07')}")
    
    # Current y position for content
    y = card_y - card_height - 30
    
    def draw_section_title(title, emoji, y_pos):
        """Draw a section title with health theme."""
        c.setFillColor(medical_blue)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, y_pos, f"{emoji} {title}")
        
        # Add decorative line
        c.setStrokeColor(medical_blue)
        c.setLineWidth(1.5)
        c.line(50, y_pos - 10, width - 50, y_pos - 10)
        
        return y_pos - 35
    
    def draw_wrapped_text(text, x, y, width, font_name="Helvetica", font_size=12, line_height=15):
        """Draw text with word wrapping to fit within specified width."""
        c.setFont(font_name, font_size)
        text_width = width - 30  # Accounting for padding
        
        # Calculate roughly how many characters fit in the available width
        avg_char_width = c.stringWidth("x", font_name, font_size)
        chars_per_line = int(text_width / avg_char_width)
        
        # Wrap text to fit width
        wrapped_text = textwrap.fill(text, width=chars_per_line)
        lines = wrapped_text.split('\n')
        
        # Draw each line
        current_y = y
        for line in lines:
            c.drawString(x, current_y, line)
            current_y -= line_height
            
        # Return the new y position after all text is drawn
        return current_y
    
    def draw_content_box(content, y_pos, is_warning=False):
        """Draw content in a styled box with text wrapping."""
        # Calculate available width for text
        box_width = width - 100
        text_width = box_width - 30  # Padding on both sides
        
        # Estimate how many characters fit in the available width
        c.setFont("Helvetica", 12)
        avg_char_width = c.stringWidth("x", "Helvetica", 12)
        chars_per_line = int(text_width / avg_char_width)
        
        # Wrap text to fit within box
        wrapped_text = textwrap.fill(content, width=chars_per_line)
        lines = wrapped_text.split('\n')
        
        # Calculate box height based on number of lines
        line_height = 15
        text_height = len(lines) * line_height
        box_height = text_height + 20  # Add padding
        box_height = max(box_height, 40)  # Minimum height
        
        # Check if we need a new page
        if y_pos - box_height < 50:
            c.showPage()
            # Redraw background on new page
            c.setFillColor(light_blue)
            c.rect(0, 0, width, height, fill=1)
            
            # Add health pattern to new page too
            c.setStrokeColor(medical_blue)
            c.setLineWidth(1)
            y_pattern = height - 15
            x_pattern = 0
            while x_pattern < width:
                c.line(x_pattern, y_pattern, x_pattern + 5, y_pattern)
                x_pattern += 5
                c.line(x_pattern, y_pattern, x_pattern + 2, y_pattern - 10)
                x_pattern += 2
                c.line(x_pattern, y_pattern - 10, x_pattern + 2, y_pattern + 10)
                x_pattern += 2
                c.line(x_pattern, y_pattern + 10, x_pattern + 2, y_pattern - 5)
                x_pattern += 2
                c.line(x_pattern, y_pattern - 5, x_pattern + 5, y_pattern)
                x_pattern += 15
                
            y_pos = height - 50
        
        # Box styling
        if is_warning:
            box_color = warning_orange
            c.setFillColor(colors.HexColor("#FFF7ED"))  # Light orange background
        else:
            box_color = medical_blue
            c.setFillColor(white)
            
        c.roundRect(50, y_pos - box_height, box_width, box_height, 8, fill=1, stroke=0)
        
        c.setStrokeColor(box_color)
        c.setLineWidth(1)
        c.roundRect(50, y_pos - box_height, box_width, box_height, 8, fill=0, stroke=1)
        
        # Add a colored bar on the left side for visual interest
        c.setFillColor(box_color)
        c.rect(50, y_pos - box_height, 5, box_height, fill=1, stroke=0)
        
        # Draw each line of text
        c.setFillColor(text_dark)
        text_y = y_pos - 15  # Start position for text (top padding)
        
        for line in lines:
            c.setFont("Helvetica", 12)
            c.drawString(65, text_y, line)
            text_y -= line_height
        
        return y_pos - box_height - 20
    
    def draw_bullet_list(items, y_pos):
        """Draw a list of bullet points with text wrapping and circle bullets."""
        for item in items:
            # Calculate available width for text
            box_width = width - 100
            text_width = box_width - 50  # Extra space for bullet icon
            
            # Estimate characters per line
            c.setFont("Helvetica", 12)
            avg_char_width = c.stringWidth("x", "Helvetica", 12)
            chars_per_line = int(text_width / avg_char_width)
            
            # Wrap text
            wrapped_text = textwrap.fill(item, width=chars_per_line)
            lines = wrapped_text.split('\n')
            
            # Calculate box height based on text
            line_height = 15
            text_height = len(lines) * line_height
            box_height = text_height + 15  # Add padding
            box_height = max(box_height, 25)  # Minimum height
            
            # Check if we need a new page
            if y_pos - box_height < 50:
                c.showPage()
                # Redraw background on new page
                c.setFillColor(light_blue)
                c.rect(0, 0, width, height, fill=1)
                
                # Add health pattern to new page too
                c.setStrokeColor(medical_blue)
                c.setLineWidth(1)
                y_pattern = height - 15
                x_pattern = 0
                while x_pattern < width:
                    c.line(x_pattern, y_pattern, x_pattern + 5, y_pattern)
                    x_pattern += 5
                    c.line(x_pattern, y_pattern, x_pattern + 2, y_pattern - 10)
                    x_pattern += 2
                    c.line(x_pattern, y_pattern - 10, x_pattern + 2, y_pattern + 10)
                    x_pattern += 2
                    c.line(x_pattern, y_pattern + 10, x_pattern + 2, y_pattern - 5)
                    x_pattern += 2
                    c.line(x_pattern, y_pattern - 5, x_pattern + 5, y_pattern)
                    x_pattern += 15
                    
                y_pos = height - 50
                
            # Draw bullet point box
            c.setFillColor(white)
            c.roundRect(50, y_pos - box_height, box_width, box_height, 8, fill=1, stroke=0)
            
            c.setStrokeColor(medical_blue)
            c.setLineWidth(0.5)
            c.roundRect(50, y_pos - box_height, box_width, box_height, 8, fill=0, stroke=1)
            
            # Draw circle bullet
            bullet_x = 65
            bullet_y = y_pos - 15
            bullet_radius = 3
            
            c.setFillColor(accent_green)
            c.circle(bullet_x, bullet_y, bullet_radius, fill=1)
            
            # Draw each line of text
            c.setFillColor(text_dark)
            text_y = y_pos - 15  # Start position (with padding)
            
            for i, line in enumerate(lines):
                c.setFont("Helvetica", 12)
                # Only add indent for first line since it has the bullet
                x_pos = 80 if i == 0 else 80
                c.drawString(x_pos, text_y, line)
                text_y -= line_height
            
            y_pos -= (box_height + 5)  # Move down for next bullet with spacing
        
        return y_pos
    
    # Summary Section
    y = draw_section_title("Summary", "📄", y)
    summary = data.get("summary", "No summary data available for this health report.")
    y = draw_content_box(summary, y)
    
    # Diagnosis Section
    if "diagnosis" in data:
        y = draw_section_title("Diagnosis", "🧬", y - 10)
        y = draw_bullet_list(data["diagnosis"], y)
    
    # Warnings Section with alert styling
    if "warnings" in data and data["warnings"]:
        y = draw_section_title("Warnings", "⚠️", y - 10)
        for warning in data["warnings"]:
            y = draw_content_box(warning, y, is_warning=True)
    
    # Remedies Section
    if "remedies" in data:
        y = draw_section_title("Remedies", "🍀", y - 10)
        y = draw_bullet_list(data["remedies"], y)
    
    # Lifestyle Changes
    if "lifestyle_changes" in data:
        y = draw_section_title("Lifestyle Changes", "🏃‍♂️", y - 10)
        y = draw_bullet_list(data["lifestyle_changes"], y)
    
    # Medicine suggestions
    if "medicine_suggestions" in data:
        y = draw_section_title("Medicine Suggestions", "💊", y - 10)
        y = draw_bullet_list(data["medicine_suggestions"], y)
    
    # Explanations in a technical format
    if "explanation" in data:
        y = draw_section_title("Explanations", "📘", y - 10)
        for key, val in data["explanation"].items():
            y = draw_content_box(f"{key}: {val}", y)
    
    # Footer with health theme
    c.setStrokeColor(medical_blue)
    c.setLineWidth(0.5)
    c.line(50, 50, width - 50, 50)
    
    # Small heartbeat line in footer
    c.setStrokeColor(accent_green)
    c.setLineWidth(1)
    x_start = width/2 - 50
    c.line(x_start, 30, x_start + 10, 30)
    c.line(x_start + 10, 30, x_start + 15, 20)
    c.line(x_start + 15, 20, x_start + 20, 40)
    c.line(x_start + 20, 40, x_start + 25, 30)
    c.line(x_start + 25, 30, x_start + 35, 30)
    
    # Footer text
    c.setFillColor(text_dark)
    c.setFont("Helvetica", 10)
    c.drawCentredString(width / 2, 15, "© 2025 HealthGPT | Empowering Health with AI 🧠")
    
    c.save()
    buffer.seek(0)
    return buffer.read()