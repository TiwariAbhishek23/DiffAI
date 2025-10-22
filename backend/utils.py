from libratom.lib.pff import PffArchive
from datetime import datetime
from typing import List
import logging
from models import EmailResult

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def extract_emails_from_folder(folder, start_time: datetime, end_time: datetime, results: List[EmailResult]):
    """Recursively extract emails from folder and subfolders."""
    # Process messages
    num_messages = folder.get_number_of_sub_messages()
    for i in range(num_messages):
        message = folder.get_sub_message(i)
        msg_time = message.delivery_time or message.client_submit_time
        
        if msg_time and start_time <= msg_time <= end_time:
            sender = message.sender_name or "Unknown Sender"
            subject = message.subject or "(No Subject)"
            
            # Format date as MM/DD/YYYY HH:MM
            date_str = msg_time.strftime("%b %d %Y %I:%M %p")
            
            results.append(EmailResult(
                date=date_str,
                sender=sender,
                subject=subject
            ))
    
    # Recurse subfolders
    num_subfolders = folder.get_number_of_sub_folders()
    for j in range(num_subfolders):
        subfolder = folder.get_sub_folder(j)
        extract_emails_from_folder(subfolder, start_time, end_time, results)

def process_pst_ost_file(file_path: str, start_time: datetime, end_time: datetime) -> List[EmailResult]:
    """Process .pst/.ost file and return filtered emails."""
    results = []
    try:
        logging.info(f"Processing file: {file_path}")
        with PffArchive(file_path) as archive:
            root_folder = archive.get_root_folder()
            extract_emails_from_folder(root_folder, start_time, end_time, results)
        logging.info(f"Found {len(results)} emails in date range")
        return results
    except Exception as e:
        logging.error(f"Error processing file: {e}")
        raise