import json
from flask import Flask, request, Response
from urllib import request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

APPID = "dj00aiZpPU5vR0Z4UXFJNHFaWSZzPWNvbnN1bWVyc2VjcmV0Jng9MzE-"  
URL = "https://jlp.yahooapis.jp/KouseiService/V2/kousei"

def post(query):
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Yahoo AppID: {}".format(APPID),
    }
    param_dic = {
      "id": "1234-1",
      "jsonrpc" : "2.0",
      "method": "jlp.kouseiservice.kousei",
      "params" : {
         "q": query
      }
    }
    params = json.dumps(param_dic).encode()
    req = request.Request(URL, params, headers)
    with request.urlopen(req) as res:
        body = res.read()
    return json.loads(body.decode())


# テスト
@app.route('/api/test', methods=['GET'])

def test():
    response = post("今の構造でいいのか許容すべき制約部屋の料金計算は非同期である良い時なぜ良いのか責務がわかりやすい循環参照がない，閉じている責務で区切っているのでこれが最小単位仕方なく許容した点処理が膨らんでいく悪い時なぜ悪いのか責務をItemで区切っているので，部屋を変更，同じ部屋を連続選択，oldがあるときの部屋選択などなど状況ごとにItem内で解決すべき処理が膨らんでいくどのように変更できるかどこかで状況を分割するポイントを作る")
    response_data = json.dumps(response, ensure_ascii=False)
    return Response(response_data, content_type='application/json; charset=utf-8')

# 本番
@app.route('/api/process-input', methods=['POST'])
def process_input():
    input_text = request.json['input']
    response = post(input_text)
    response_data = json.dumps(response, ensure_ascii=False)
    return Response(response_data, content_type='application/json; charset=utf-8')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)





# import json
# from urllib import request
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# APPID = "dj00aiZpPU5vR0Z4UXFJNHFaWSZzPWNvbnN1bWVyc2VjcmV0Jng9MzE-"  
# URL = "https://jlp.yahooapis.jp/KouseiService/V2/kousei"

# app = Flask(__name__)
# CORS(app)

# def post(query):
#     headers = {
#         "Content-Type": "application/json",
#         "User-Agent": "Yahoo AppID: {}".format(APPID),
#     }
#     param_dic = {
#       "id": "1234-1",
#       "jsonrpc" : "2.0",
#       "method": "jlp.kouseiservice.kousei",
#       "params" : {
#          "q": query
#       }
#     }
#     params = json.dumps(param_dic).encode()
#     req = request.Request(URL, params, headers)
#     with request.urlopen(req) as res:
#         body = res.read()
#     return body.decode()

# @app.route('/api/process-input', methods=['POST'])
# def process_input():
#     input_text = request.json['input']
#     response = post(input_text)
#     return jsonify({'result': response})

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)








# ---------------------------------------------------------------------------------------

# import json
# from urllib import request

# APPID = "dj00aiZpPU5vR0Z4UXFJNHFaWSZzPWNvbnN1bWVyc2VjcmV0Jng9MzE-"  
# URL = "https://jlp.yahooapis.jp/KouseiService/V2/kousei"


# def post(query):
#     headers = {
#         "Content-Type": "application/json",
#         "User-Agent": "Yahoo AppID: {}".format(APPID),
#     }
#     param_dic = {
#       "id": "1234-1",
#       "jsonrpc" : "2.0",
#       "method": "jlp.kouseiservice.kousei",
#       "params" : {
#          "q": query
#       }
#     }
#     params = json.dumps(param_dic).encode()
#     req = request.Request(URL, params, headers)
#     with request.urlopen(req) as res:
#         body = res.read()
#     return body.decode()


# response = post("セキュリティー,食べれる")
# print(response)