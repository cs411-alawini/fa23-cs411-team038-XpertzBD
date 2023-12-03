from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import datetime,random,string,requests

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/create": {"origins": "http://localhost:3000"}})

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

def convert_date_format(input_date):
    # Parse the input date string
    date = datetime.strptime(input_date, "%Y/%m/%d")

    # Extract the month, day, and year, and format the date as M/D/YY
    month = date.month  # month as a number without leading zero
    day = date.day      # day as a number without leading zero
    year = date.strftime("%y")  # year in two-digit format

    return f"{month}/{day}/{year}"

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/test_db')
def test_db():
    try:
        # Connect to the database
        connection = pymysql.connect(host=host, user=user, password=password, db=dbname)
        
        with connection.cursor() as cursor:
            # Perform a simple test query
            cursor.execute("SELECT CURDATE()")
            result = cursor.fetchone()

        return f"Database connection successful. Date from DB: {result[0]}"
    except Exception as e:
        return f"Database connection failed: {e}", 500

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
    

@app.route('/search', methods=['GET'])
def Search_case():
    try:
       
        #CrimeDate = convert_date_format(request.args.get('Date'))
        CrimeDate = request.args.get('Date')
        WeaponType = request.args.get('WeaponType')
        CrimeType = request.args.get('CrimeType')
        CrimeTime = request.args.get('Time')
        Premis = request.args.get('Premis')
        Judge = request.args.get('Judge')
        Modus_operandi = request.args.get('Modus_operandi')
        # Lat = request.args.get('LAT')
        # Lon = request.args.get('LON')

        search_query = "SELECT * FROM Crime c join WeaponDesc w on c.Weapon_Used_Cd=w.WeaponUsedCd join ModusOperandi m on c.Mocode1=m.Mocodes natural join Crime_Desc WHERE 1=1"
        query_parameters = []

        if CrimeDate:
            search_query += " AND Date_OCC = %s"
            query_parameters.append(CrimeDate)
        if CrimeTime:
            search_query += " AND Time_OCC = %s"
            query_parameters.append(CrimeTime) 
        if Premis:
            search_query += " AND PremisDesc = %s"
            query_parameters.append(Premis) 
        if Judge:
            search_query += " AND Judge_Status_desc = %s"
            query_parameters.append(Judge) 
        # if Modus_operandi:
        #     search_query += " AND Mocodes_Desc LIKE %s"
        #     query_parameters.append(Modus_operandi)                 
        # if Lat:
        #     search_query += " AND LAT = %s"
        #     query_parameters.append(Lat)     
        # if Lon:
        #     search_query += " AND LON = %s"
        #     query_parameters.append(Lon)         
        if WeaponType:
            WeaponID = WeaponTypeDic.get(WeaponType)
            if WeaponID:
                search_query += " AND Weapon_Used_Cd = %s"
                query_parameters.append(WeaponID)
        if CrimeType:
            CrimeID = CrimeTypeDic.get(CrimeType)
            if CrimeID:
                search_query += " AND Crm_cd = %s"
            query_parameters.append(CrimeID)

         # Connect to the database
        connection = pymysql.connect(host=host, user=user, password=password, db=dbname)    
        with connection.cursor() as cursor:
            cursor.execute(search_query, tuple(query_parameters))
            results = cursor.fetchall()

        return jsonify(results)
    except Exception as e:
        print('Error:', e)
        return jsonify({'error': str(e)})    

@app.route('/create',methods=['POST'])
def Create_case():
    try:
        while True:
            Dr_ID = generate_random_id()
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM Crime WHERE Dr_ID = %s", (Dr_ID,))
                if cursor.fetchone()[0] == 0:
                    break  # Unique ID found
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
