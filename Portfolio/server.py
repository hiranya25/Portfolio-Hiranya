import http.server
import socketserver
import json
import os

PORT = 8000
FEEDBACK_FILE = 'feedback.json'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/submit-feedback':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Check if file exists, if not create empty list
                if not os.path.exists(FEEDBACK_FILE):
                    with open(FEEDBACK_FILE, 'w') as f:
                        json.dump([], f)
                
                # Read existing feedback
                with open(FEEDBACK_FILE, 'r') as f:
                    try:
                        feedback_list = json.load(f)
                    except json.JSONDecodeError:
                        feedback_list = []
                
                # Add new feedback
                feedback_list.append(data)
                
                # Write back to file
                with open(FEEDBACK_FILE, 'w') as f:
                    json.dump(feedback_list, f, indent=4)
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'success', 'message': 'Feedback received'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_error(404, "File not found")

print(f"Serving at port {PORT}")
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.serve_forever()
