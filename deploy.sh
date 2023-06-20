# Set the Heroku app name
APP_NAME="task-manager-renect"

# Check if the app already exists
echo "Checking if the app already exists..."
heroku apps:info $APP_NAME >/dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "The app $APP_NAME already exists."
  heroku config:set JWT_SECRET="vH9MxvWqK5RhnGql6jiWBPAeU99gwJKxLfufjlh4yR8" SENDGRID_API_KEY='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' DATABASE_URL='mongodb+srv://tudosm:H2qYRjAzRazKDqv@taskmanagerapp.ddmulx2.mongodb.net/?retryWrites=true&w=majority' -a=$APP_NAME
  heroku buildpacks:set heroku/nodejs -a $APP_NAME
  heroku git:remote -a task-manager-renect
  git push heroku main
  exit 1
fi

# App does not exist, create a new one
echo "Creating a new Heroku app..."
heroku create $APP_NAME

# Set up Heroku buildpacks
echo "Setting up buildpacks..."
heroku buildpacks:set heroku/nodejs -a $APP_NAME

# Deploy to Heroku
echo "Deploying to Heroku..."
git push heroku main

# Open the app in a browser
echo "Opening the app..."
heroku open -a $APP_NAME