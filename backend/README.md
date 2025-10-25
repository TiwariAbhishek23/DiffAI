# To run the backend server, follow these steps

1. Create a virtual environment:
   python3 -m venv venv
   source venv/bin/activate
   for Windows:
   .\venv\Scripts\activate (check it)

2. Install the required packages:
   pip install -r requirements.txt

3. Run the server:
   uvicorn main:app --reload
