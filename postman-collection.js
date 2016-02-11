{
	"id": "80ed7904-3b30-afeb-e942-76c10d1addd8",
	"name": "Karniyarik",
	"description": "Karniyarik business model collection\n",
	"order": [
		"54c3f28c-9779-6eb8-0cbc-ff3ea424a5b0",
		"e3ad436d-0579-828b-1b3b-f944bab5fc59",
		"7ec85785-1c07-0d16-ab2a-0ba54dfdb3ea",
		"6000717f-98fb-7d13-1a40-e9e93f56fb4e",
		"60f08c43-b175-64dc-af5a-106b80386c94",
		"42de8d43-172f-f70f-48d2-fa34ce603215",
		"46f723d7-43e8-a78c-58d6-de0cc9986c66"
	],
	"folders": [],
	"timestamp": 1454719356179,
	"owner": "306256",
	"remoteLink": "",
	"public": false,
	"requests": [
		{
			"id": "42de8d43-172f-f70f-48d2-fa34ce603215",
			"headers": "Content-Type: application/json\nAuthorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFtamVkIiwiZ2NtX3JlZ2lzdHJhaW9uX2lkIjoiaWQxMjNpZCIsImlhdCI6MTQ1NTE0MjAwM30.RsQUdleVYuUngrTSGl2vTVESxiqENxcl3V3WZifvYHo\n",
			"url": "localhost:3000/api/dirvers/56b282352dd1b58eac528a6d",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "DELETE",
			"data": [],
			"dataMode": "raw",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455147372547,
			"name": "Update - Put  localhost:3000/api/drivers/:driver_id",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": [],
			"rawModeData": ""
		},
		{
			"id": "46f723d7-43e8-a78c-58d6-de0cc9986c66",
			"headers": "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFtamVkIiwiZ2NtX3JlZ2lzdHJhaW9uX2lkIjoiaWQxMjNpZCIsImlhdCI6MTQ1NTE0MjAwM30.RsQUdleVYuUngrTSGl2vTVESxiqENxcl3V3WZifvYHo\n",
			"url": "localhost:3000/api/users",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "GET",
			"data": [
				{
					"key": "username",
					"value": "amjed",
					"type": "text",
					"enabled": true
				},
				{
					"key": "password",
					"value": "amjed",
					"type": "text",
					"enabled": true
				},
				{
					"key": "registration_id",
					"value": "id123id",
					"type": "text",
					"enabled": true
				}
			],
			"dataMode": "params",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455147307294,
			"name": "All Users - localhost:3000/api/users",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": []
		},
		{
			"id": "54c3f28c-9779-6eb8-0cbc-ff3ea424a5b0",
			"headers": "Content-Type: application/json\n",
			"url": "localhost:3000/api/authentication/jwt_token",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "POST",
			"data": [],
			"dataMode": "raw",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455057823896,
			"name": "Create JWT Token - localhost:3000/api/authentication/jwt_token",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": [],
			"rawModeData": "{\"username\":\"amjed\", \n\"password\":\"amjed\", \n\"registration_id\":\"id123id\"\n}"
		},
		{
			"id": "6000717f-98fb-7d13-1a40-e9e93f56fb4e",
			"headers": "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFtamVkIiwiZ2NtX3JlZ2lzdHJhaW9uX2lkIjoiaWQxMjNpZCIsImlhdCI6MTQ1NTE0NzAzMH0.s97RrT3CHDY9dtHpDGQkHh6Ze87Ci1bcDUM_7uxcVz0\n",
			"url": "localhost:3000/api/drivers/56b692aec53d9c3cf6e2292a",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "GET",
			"data": [
				{
					"key": "username",
					"value": "amjed",
					"type": "text",
					"enabled": true
				},
				{
					"key": "password",
					"value": "amjed",
					"type": "text",
					"enabled": true
				},
				{
					"key": "registration_id",
					"value": "id123id",
					"type": "text",
					"enabled": true
				}
			],
			"dataMode": "params",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455147117649,
			"name": "Get one localhost:3000/api/drivers/:driver_id",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": []
		},
		{
			"id": "60f08c43-b175-64dc-af5a-106b80386c94",
			"headers": "Content-Type: application/json\nAuthorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFtamVkIiwiZ2NtX3JlZ2lzdHJhaW9uX2lkIjoiaWQxMjNpZCIsImlhdCI6MTQ1NTE0NzAzMH0.s97RrT3CHDY9dtHpDGQkHh6Ze87Ci1bcDUM_7uxcVz0\n",
			"url": "localhost:3000/api/drivers/56b692aec53d9c3cf6e2292a",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "PUT",
			"data": [],
			"dataMode": "raw",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455152618840,
			"name": "Update - Put  localhost:3000/api/drivers/:driver_id copy",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": [],
			"rawModeData": "{\n \"fname\": \"Batak\"\n}"
		},
		{
			"id": "7ec85785-1c07-0d16-ab2a-0ba54dfdb3ea",
			"headers": "Content-Type: application/json\nAuthorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFtamVkIiwiZ2NtX3JlZ2lzdHJhaW9uX2lkIjoiaWQxMjNpZCIsImlhdCI6MTQ1NTE0NzAzMH0.s97RrT3CHDY9dtHpDGQkHh6Ze87Ci1bcDUM_7uxcVz0\n",
			"url": "localhost:3000/api/drivers",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "POST",
			"data": [],
			"dataMode": "raw",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455147056999,
			"name": "Post localhost:3000/drivers",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": [],
			"rawModeData": "{\n  \"fname\": \"Max\",\n  \"lname\": \"Rosemann\",\n  \"email\": \"max.rosemann@gmail.com\",\n  \"gender\": \"Male\",\n  \"dob\": \"1986-02-06T00:00:00.000Z\",\n  \"mobile\": \"1234567890\",\n  \"licensenumber\": \"license-123\",\n  \"licenseexpirydate\": \"2019-02-07T00:00:00.000Z\",\n  \"insurancenumber\": \"insurance-123\",\n  \"insuranceexpirydate\": \"2017-01-20T00:00:00.000Z\",\n  \"country\": \"Turkey\",\n  \"state\": \"Ankara\",\n  \"city\": \"Ankara\",\n  \"addressline1\": \"Address-1\",\n  \"addressline2\": \"Address-2\",\n  \"postal\": \"123456\"\n}"
		},
		{
			"id": "e3ad436d-0579-828b-1b3b-f944bab5fc59",
			"headers": "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFtamVkIiwiZ2NtX3JlZ2lzdHJhaW9uX2lkIjoiaWQxMjNpZCIsImlhdCI6MTQ1NTE0MjAwM30.RsQUdleVYuUngrTSGl2vTVESxiqENxcl3V3WZifvYHo\n",
			"url": "localhost:3000/api/drivers",
			"preRequestScript": "",
			"pathVariables": {},
			"method": "GET",
			"data": [
				{
					"key": "username",
					"value": "amjed",
					"type": "text",
					"enabled": true
				},
				{
					"key": "password",
					"value": "amjed",
					"type": "text",
					"enabled": true
				},
				{
					"key": "registration_id",
					"value": "id123id",
					"type": "text",
					"enabled": true
				}
			],
			"dataMode": "params",
			"version": 2,
			"tests": "",
			"sandboxFiles": "",
			"currentHelper": "normal",
			"helperAttributes": {},
			"time": 1455142031455,
			"name": "All drivers - localhost:3000/api/drivers copy",
			"description": "",
			"collectionId": "80ed7904-3b30-afeb-e942-76c10d1addd8",
			"responses": []
		}
	]
}