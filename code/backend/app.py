from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import datetime,random,string,requests
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from openai import OpenAI

client = OpenAI(api_key='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')
import os

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret'  # Change this to a random secret key
jwt = JWTManager(app)
CORS(app, origins="http://localhost:3000")

# db config
host = "34.173.12.149"
user = "root"
password = "canes"
dbname = "CrimeData"

# Connect to the database
connection = pymysql.connect(host=host, user=user, password=password, db=dbname)

# Fetch users and their passwords from the database and store in users{}
def All_users():
    try:
        with connection.cursor() as cursor:
            sql = "SELECT UserName, Password FROM User"
            cursor.execute(sql)
            result = cursor.fetchall()
            users = {username: {'password': password} for username, password in result}
            return users
    except Exception as e:
        f"Database connection failed: {e}", 500
    

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
    
def convert_date_format(input_date):
    # Parse the input date string
    date = datetime.strptime(input_date, "%Y/%m/%d")

    # Extract the month, day, and year, and format the date as M/D/YY
    month = date.month  # month as a number without leading zero
    day = date.day      # day as a number without leading zero
    year = date.strftime("%y")  # year in two-digit format

    return f"{month}/{day}/{year}"

# Function to check if the userID is unique
def is_user_id_unique(userID, cursor):
    sql = "SELECT EXISTS(SELECT 1 FROM User WHERE UserID=%s)"
    cursor.execute(sql, (userID,))
    return cursor.fetchone()[0] == 0

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/signin', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    users = All_users()
    # print(users)
    
    # This should be replaced with a database lookup
    if username not in users or not check_password_hash(users[username]['password'], password):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

def is_username_unique(username, cursor):
    sql = "SELECT COUNT(*) FROM User WHERE UserName = %s"
    cursor.execute(sql, (username,))
    result = cursor.fetchone()
    return result[0] == 0

@app.route('/signup', methods=['POST'])
def signup():
    username = request.json.get('username')
    password = request.json.get('password')
    print("username,Password:", username,password)
    try:
            with connection.cursor() as cursor:
                
                # Check if the username is unique
                if not is_username_unique(username, cursor):
                    return jsonify({"msg": "Signup failed Usernmae already taken", "error": "Username already taken"}), 400

                # Generate a unique UserID
                userID = generate_random_id()
                while not is_user_id_unique(userID, cursor):
                    userID = generate_random_id()
                print("UserID: ",userID)

                # Hash the user's password
                hashed_password = generate_password_hash(password)
                
                # Insert the new user into the database
                sql = "INSERT INTO User (UserID, UserName, Password) VALUES (%s, %s, %s)"
                cursor.execute(sql, (userID, username, hashed_password))
                connection.commit()
                
                return jsonify({"msg": "Signup successful", "userID": userID}), 200
    except Exception as e:
        # Handle exception
        return jsonify({"msg": "Signup failed", "error": str(e)}), 500


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

        search_query = "SELECT * FROM Crime c LEFT OUTER join WeaponDesc w on c.Weapon_Used_Cd=w.WeaponUsedCd LEFT OUTER join ModusOperandi m on c.Mocode1=m.Mocodes natural left outer join Crime_Desc WHERE 1=1"
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
        CrimeTime = data.get('Time')
        CrimeDate = data.get('Date')
        WeaponType = data.get('WeaponType')
        Premis = data.get('Premis')
        Judge = data.get('Judge')

        WeaponID = WeaponTypeDic[WeaponType]
        CrimeType = data.get('CrimeType')
        CrimeID = CrimeTypeDic[CrimeType]
        ReportDate = datetime.datetime.now().strftime('%m/%d/%y')
        
         # Geocode the address to get LAT and LON
        LAT, LON = get_lat_lon_from_address(Location)
                
        with connection.cursor() as cursor:
            # Prepare SQL query with all required fields
            sql = """INSERT INTO Crime (Dr_ID, Date_Rptd, Date_OCC, Crm_cd, Weapon_Used_Cd, LAT, LON, Time_OCC, PremisDesc, Judge_Status_desc) 
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (Dr_ID, ReportDate, CrimeDate, CrimeID, WeaponID, LAT, LON, CrimeTime, Premis, Judge))
            connection.commit()
            
            
            return jsonify({'message': 'New Crime case added successfully.'})
    except Exception as e:
        connection.rollback()
        print('Error:', e)
        return jsonify({'error': str(e)})
        

@app.route('/advancedSQL1')
def advSQL1():
     with connection.cursor() as cursor:
        # SQL query
        sql = """select c2.crm_cd, c2.frequency, cd.Crm_cd_desc
                from 
                (Select crm_cd, count(*) as frequency
                from ((select Dr_ID, Crm_cd1 as crm_cd from Crime)
                Union (select Dr_ID, Crm_cd2 as crm_cd from Crime)
                    Union (select Dr_ID, Crm_cd3 as crm_cd from Crime)
                    Union (select Dr_ID, Crm_cd4 as crm_cd from Crime)) as c1
                where crm_cd != ""
                group by crm_cd
                order by frequency desc) as c2
                left join Crime_Desc cd on c2.crm_cd=cd.Crm_cd"""
        cursor.execute(sql)
        results = cursor.fetchall()

        # Convert results to a list of dictionaries for JSON response
        crime_list = []
        for row in results:
            crime_dict = {
                "crm_cd": row[0],
                "frequency": row[1],
                "Crm_cd_desc": row[2],
            }
            crime_list.append(crime_dict)
     return jsonify(crime_list)  


@app.route('/advancedSQL2')
def advSQL2():
     with connection.cursor() as cursor:
        # SQL query
        sql = """   Select HourofDay, total_frequency as total_cases,
                    PremisDesc as Most_PremisDesc_class, 
                        frequency as cases_of_most_PremisDesc, 
                        frequency/total_frequency as portion
                    from
                    (select HourofDay, count(Dr_ID) as total_frequency
                    from(
                    select Dr_ID, floor(Time_OCC/100) as HourofDay
                    from Crime
                    where Time_OCC != "") as kk7
                    group by HourofDay
                    order by HourofDay) as kk8
                    natural join
                    (select kk2.HourofDay, PremisDesc, frequency
                    from 
                    (select HourofDay,PremisDesc, count(Dr_ID) as frequency
                    from (
                    select Dr_ID, PremisDesc, floor(Time_OCC/100) as HourofDay
                    from Crime
                    where Time_OCC != "") as kk1
                    group by PremisDesc, HourofDay
                    order by HourofDay) as kk2
                    left join
                    (select HourofDay, max(frequency) as max_frequency
                    from(
                    select HourofDay,PremisDesc, count(Dr_ID) as frequency
                    from (
                    select Dr_ID, PremisDesc, floor(Time_OCC/100) as HourofDay
                    from Crime
                    where Time_OCC != "") as kk3
                    group by PremisDesc, HourofDay
                    order by HourofDay) as kk4
                    group by HourofDay) as kk5
                    on kk2.HourofDay=kk5.HourofDay
                    where frequency=max_frequency) as kk6"""
        cursor.execute(sql)
        results = cursor.fetchall()

        # Convert results to a list of dictionaries for JSON response
        crime_list = []
        for row in results:
            crime_dict = {
                "Hour": row[0],
                "totalCase": row[1],
                "top1Premis": row[2],
                "top1cases": row[3],
                "portion": row[4]
            }
            crime_list.append(crime_dict)
     return jsonify(crime_list)  


@app.route('/generateSummary2')
def generate_summary2():
    # model = "gpt-3.5-turbo"
    # temperature = 0.7
   
    # response1 = requests.get('http://127.0.0.1:5000/advancedSQL1').json()
    response2 = requests.get('http://127.0.0.1:5000/advancedSQL2').json()
    # print(response1+response2)

    # Format the data for GPT-3.5
    formatted_data = f"Advanced SQL Query 2 Results:\n{response2}\n\n"
    print (formatted_data)
    
    # Call OpenAI's GPT-3.5 model to generate the summary
    summary_response = client.chat.completions.create(
    messages=[
    {"role": "system", "content": "The query results provides a detailed hourly breakdown of criminal incidents, revealing patterns in total cases, predominant crime locations, and their relative proportions. Based on the query results, please provide a 250-word summary and tell people how to be safer in LA."},
    {"role": "user", "content": formatted_data}
    ],
    model="gpt-3.5-turbo")

    # Extract and return the summary
    summary = summary_response.choices[0].message
    print(summary)

    return str(summary)

@app.route('/generateSummary1')
def generate_summary1():
    # model = "gpt-3.5-turbo"
    # temperature = 0.7
   
    response1 = requests.get('http://127.0.0.1:5000/advancedSQL1').json()
    
    # print(response1+response2)

    # Format the data for GPT-3.5
    formatted_data = f"Advanced SQL Query 1 Results:\n{response1}\n\n"
    print (formatted_data)
    
    # Call OpenAI's GPT-3.5 model to generate the summary
    summary_response = client.chat.completions.create(
    messages=[
    {"role": "system", "content": "The query results show various criminal activities in LA, along with their corresponding crime codes and frequencies of occurrence. Based on the query results, please provide a 250-word summary of your key findings."},
    {"role": "user", "content": formatted_data}
    ],
    model="gpt-3.5-turbo")

    # Extract and return the summary
    summary = summary_response.choices[0].message
    print(summary)

    return str(summary)


if __name__ == '__main__':
    app.run(debug=True)
