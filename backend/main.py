# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse
# import tempfile
# import aspose.email as ae

# app = FastAPI()

# @app.post("/read_pst_ost/")
# async def read_pst_ost(file: UploadFile = File(...)):
#     try:
#         with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
#             tmp.write(await file.read())
#             tmp_path = tmp.name

#         storage = ae.storage.pst.PersonalStorage.from_file(tmp_path)

#         messages = []
#         folders = storage.root_folder.get_sub_folders()

#         for folder in folders:
#             for message_info in folder.enumerate_messages():
#                 msg = storage.extract_message(message_info)

#                 messages.append({
#                     "subject": msg.subject,
#                     "from": msg.sender_email_address,  # ✅ Correct attribute
#                     "sender_name": msg.sender_name,
#                     "to": [r.email_address for r in msg.recipients] if msg.recipients else [],
#                     "sent_on": str(msg.delivery_time),
#                 })

#         return JSONResponse({
#             "total_messages": len(messages),
#             "messages_preview": messages[:10]  # Return first 10 for preview
#         })

#     except Exception as e:
#         return JSONResponse({"error": str(e)}, status_code=500)
