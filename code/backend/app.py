from flask import Flask
import pymysql

app = Flask(__name__)


# db config
host = "34.173.12.149"
user = "root"
password = "canes"
dbname = "CrimeData"

# Connect to the database
connection = pymysql.connect(host=host, user=user, password=password, db=dbname)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/test_db')
def test_db():
    try:
        # Connect to the database
        # connection = pymysql.connect(host=host, user=user, password=password, db=dbname)
        
        with connection.cursor() as cursor:
            # Perform a simple test query
            cursor.execute("SELECT CURDATE()")
            result = cursor.fetchone()
        
        # Close the connection
        connection.close()

        return f"Database connection successful. Date from DB: {result[0]}"
    except Exception as e:
        return f"Database connection failed: {e}", 500

if __name__ == '__main__':
    app.run(debug=True)
