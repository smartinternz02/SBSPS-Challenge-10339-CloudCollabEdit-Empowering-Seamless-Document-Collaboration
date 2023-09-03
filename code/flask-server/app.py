from flask import Flask, render_template, request, session, jsonify, redirect, url_for
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import ibm_db
import random
from flask_cors import CORS
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import bcrypt
app = Flask(__name__)
CORS(app)
conn = ibm_db.connect("ENTER_YOUR_URI_HERE")
print(conn)
connState = ibm_db.active(conn)
print('IBMDB2 Connected Successfully')
# ENTER_YOUR_APP_SECRET_KEY_FOR_A_FLASK_FOLDER
SMTP_SERVER = 'MAILID'
SMTP_PORT = "PORT"
SMTP_USERNAME = 'YOUR_PERSONAL_MAIL'
SMTP_PASSWORD = '_PASSWORD'
SENDER_EMAIL = "YOUR_PERSONAL_MAILID"

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "firstform-thunderbreathing"  # Change this!
jwt = JWTManager(app)


# @app.route('/token',methods=['POST'])
# def create_token():
#     email = request.json.get("email",None)
#     password = request.json.get("password",None)
#     if email != "test" or password != "test":
#         return jsonify({"msg":"Bad Username or password"}),401
    
#     access_token = create_access_token(identity=email)
#     return jsonify(access_token=access_token)

@app.route("/", methods = ['POST'])
def login():
    global uemail
    email = request.json.get("email", None)
    password =  request.json.get("password", None)
    details = [email, password]
    print(details)
    hashed = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
    print ("hashed",hashed)
    sql = "SELECT * FROM REGISTER_HC where EMAILID=? AND PASSWORD = ?"
    stmt = ibm_db.prepare(conn, sql)
    ibm_db.bind_param(stmt, 1, email)
    ibm_db.bind_param(stmt, 2, password)
    ibm_db.execute(stmt)
    acc = ibm_db.fetch_assoc(stmt)
    print("acc",acc)
    if acc:
        name = acc.get('NAME')
        print(name)
        access_token=create_access_token(identity={"email":email, "name": name})
        return {"access_token": access_token},200
    else:
        return 'Invalid Login Info !',400
    
# @app.route("/test", methods = ['POST'])
# def test():


# @app.route("/profile")
# def profile():
#     return render_template("profile.html")

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')
        role = request.json.get('role')
        sql = "SELECT * FROM REGISTER_HC where EMAILID=?"
        stmt = ibm_db.prepare(conn, sql)
        ibm_db.bind_param(stmt, 1, email)
        # ibm_db.bind_param(stmt, 2, name)
        ibm_db.execute(stmt)
        acc = ibm_db.fetch_assoc(stmt)
        print("41","_",acc)
        if acc:
            response = {
                "status": 201,
                "message": "You have been already REGISTERED, please login!"
            }
        else:
            sql = "INSERT into REGISTER_HC VALUES (?,?,?,?)"
            stmt = ibm_db.prepare(conn, sql)
            ibm_db.bind_param(stmt, 1, name)
            ibm_db.bind_param(stmt, 2, email)
            ibm_db.bind_param(stmt, 3, password)
            ibm_db.bind_param(stmt, 4, role)
            ibm_db.execute(stmt)
            response = {
                "status":200,
                "message": "You have Successfully REGISTERED, Please LOGIN"
            }
        return jsonify(response)

@app.route('/generate_otp', methods=['POST']) # type: ignore
def generate_otp():
    if request.method == 'POST':
        user_email = request.json.get('email')
        otp = str(random.randint(1000, 9999))

        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)

            subject = 'OTP Verification'
            body = f'Your OTP: {otp}'
            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = user_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            server.sendmail(SENDER_EMAIL, user_email, msg.as_string())
            server.quit()

            session['otp'] = otp
            session['user_email'] = user_email
            response = {"status": "success", "message": "OTP sent successfully.","otp":otp}
            print(response)
        except Exception as e:
            response = {"status": "error", "message": str(e)}
    print(session.get('otp'))
    return jsonify(response)

@app.route('/add_collab',methods=['POST'])
def add_collab():
    if request.method == 'POST':
        sender_mail=request.json.get('sender_mail')
        collab_email=request.json.get('collab_email')
        code_string=request.json.get('code_string')
        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)

            subject = 'Thunder Docs Collaboration'
            body = f'Hi,\n {sender_mail} shared a document for the Collaboration\n The document ID is {code_string}\n Copy this code and use it in the Thunder Docs Collaboration feature'
            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = collab_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            server.sendmail(SENDER_EMAIL, collab_email, msg.as_string())
            server.quit()
            response={"status":200}
        except Exception as e:
            response = {"status": "error", "message": str(e)}
            
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
