from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.errorhandler(404)
def not_found(_):
    return render_template(
        'error.html',
        code='404',
        message='Not Found',
        description='The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.'
    ), 404


@app.errorhandler(429)
def too_many_requests(_):
    return render_template(
        'error.html',
        code='429',
        message='Too Many Requests',
        description='This user has exceeded an allotted request count. Try again later.'
    ), 429


@app.errorhandler(500)
def internal_server_error(_):
    return render_template(
        'error.html',
        code='500',
        message='Internal Server Error',
        description='The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.'
    ), 500


app.run(host='0.0.0.0', port=80)
