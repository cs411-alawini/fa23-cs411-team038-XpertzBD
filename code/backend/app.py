from flask import Flask, request, jsonify
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
    
@app.route('/app/search')
def search_crime():
     with connection.cursor() as cursor:
        # SQL query
        sql = "SELECT * FROM Crime WHERE Date_OCC LIKE '1/10/21' LIMIT 20"
        cursor.execute(sql)
        results = cursor.fetchall()

        # Convert results to a list of dictionaries for JSON response
        crime_list = []
        for row in results:
            crime_dict = {
                "column1": row[0],
                "column2": row[1],
                # Add more columns as needed
            }
            crime_list.append(crime_dict)
    # Close the connection
     connection.close()
     return jsonify(crime_list)


if __name__ == '__main__':
    app.run(debug=True)
