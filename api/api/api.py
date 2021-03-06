from flask import render_template
from flask_cors import CORS
import connexion


# Create the application instance
# app = Flask(__name__, template_folder="templates")
app = connexion.App(__name__, specification_dir="./")

# Allow CORS requests
CORS(app.app)

# Read the swagger.yml file to configure the endpoints
app.add_api("siis_api.yml")


# Create a URL route in our application for "/"
@app.route("/")
def home():
    """
    This function just responds to the browser ULR
    localhost:5000/

    :return:        the rendered template 'home.html'
    """
    return render_template("home.html")


# If we're running in stand alone mode, run the application
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
