from flask import Flask, request, jsonify
from models import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///procurement.db'
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(
        name=data['name'],
        phone=data['phone'],
        role=data.get('role', 'farmer')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registered successfully", "user_id": new_user.id})

if __name__ == '__main__':
    app.run(debug=True)