from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import datetime,random,string,requests

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/create": {"origins": "http://localhost:3001"}})

# db config
host = "34.173.12.149"
user = "root"
password = "canes"
dbname = "CrimeData"

# Connect to the database
connection = pymysql.connect(host=host, user=user, password=password, db=dbname)

CrimeTypeDic = {
    'Robbery': '210',
    'Homicide': '110',
    'Burglary': '310',
    'Stalking': '763',
    'Drug': '865',
    'Kidnapping': '910',
    'Trespassing': '888',
    'Shooting': '753',
    'Theft': '350'
}
WeaponTypeDic = {
    'Shot Gun':'104',
    'Hand Gun':'102',
    'Unknown FireArm':'106',
    'Kitchen Knife':'205',
    'Folding Knife':'204',
    'Unkown Knife':'207',
    'Hammer':'311',
    'Physical':'515'
}

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


# Function to generate a random DR_ID
def generate_random_id(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

# Function to get latitude and longitude from an address using the Radar API
def get_lat_lon_from_address(address):
    api_key = 'prj_test_pk_edf72f120ac59d3e37459edee130800092a1ad2d'  # Your Radar API key
    url = "https://api.radar.io/v1/geocode/forward"
    headers = {
        "Authorization": api_key
    }
    params = {
        "query": address,
        "layers": "address"
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        # Extract latitude and longitude from the first result
        lat = data['addresses'][0]['latitude']
        lon = data['addresses'][0]['longitude']
        print('address to lat,lon from the API call: ', lat,lon)
        return lat, lon
    else:
        raise ValueError("Could not geocode address: " + response.text)

@app.route('/create',methods=['POST'])
def Create_case():
    try:
        while True:
            Dr_ID = generate_random_id()
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM Crime WHERE Dr_ID = %s", (Dr_ID,))
                if cursor.fetchone()[0] == 0:
                    break  # Unique ID found
        # print('newly reported case Dr_ID: ', Dr_ID)
        # Use request.json or request.get_json() for POST requests with JSON body
        data = request.get_json()
        # UserId = data.get('UserId')
        Location = data.get('Location')
        CrimeDate = data.get('Date')
        WeaponType = data.get('WeaponType')
        WeaponID = WeaponTypeDic[WeaponType]
        CrimeType = data.get('CrimeType')
        CrimeID = CrimeTypeDic[CrimeType]
        ReportDate = datetime.datetime.now().strftime('%m/%d/%y')
        
         # Geocode the address to get LAT and LON
        LAT, LON = get_lat_lon_from_address(Location)
                
        with connection.cursor() as cursor:
            # Prepare SQL query with all required fields
            sql = """INSERT INTO Crime (Dr_ID, Date_Rptd, Date_OCC, Crm_cd, Weapon_Used_Cd, LAT, LON) 
                     VALUES (%s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (Dr_ID, ReportDate, CrimeDate, CrimeID, WeaponID, LAT, LON))
            connection.commit()
            

            return jsonify({'message': 'New Crime case added successfully.'})
    except Exception as e:
        connection.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
        
    

if __name__ == '__main__':
    app.run(debug=True)
