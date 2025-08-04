# Angular Dashboard Application

A modern, responsive dashboard application built with Angular 17, featuring multiple chart libraries (ECharts, Chart.js, and Highcharts) with real-time filtering capabilities.

## Features

- **Multiple Chart Libraries**: Switch between ECharts, Chart.js, and Highcharts
- **Responsive Grid Layout**: Using Angular Gridster2
- **Dark/Light Theme**: Toggle between themes
- **Real-time Filters**: Filter by time range, category, and region
- **Chart Types**: Bar, Pie, Line, Scatter, and Heatmap charts

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd my-angular-app

# Install dependencies
npm install --legacy-peer-deps
```

## Development

```bash
# Start the development server
npm start

# Navigate to http://localhost:4200/
```

## Building for Production

```bash
# Build the application
npm run build:prod

# The build artifacts will be stored in the `dist/` directory
```

## Deployment on Render

### Method 1: Using Render Dashboard

1. Push your code to a GitHub repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Static Site"
4. Connect your GitHub repository
5. Configure the build settings:
   - **Name**: angular-dashboard (or your preferred name)
   - **Build Command**: `npm install --legacy-peer-deps && npm run build:prod`
   - **Publish Directory**: `dist/my-angular-app/browser`
6. Click "Create Static Site"

### Method 2: Using render.yaml (Recommended)

1. Push your code to GitHub (render.yaml is already configured)
2. Go to Render Dashboard
3. Click "New +" and select "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the render.yaml file and configure everything

### Environment Variables (if needed)

No environment variables are required for this application.

## Project Structure

```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Main dashboard component
│   │   ├── highcharts-chart/   # Highcharts component
│   │   ├── chartjs-chart/      # Chart.js component
│   │   └── services/           # Theme service
│   ├── assets/
│   └── styles.css
├── angular.json
├── package.json
├── render.yaml                  # Render deployment config
├── static.json                  # Static site routing config
└── README.md
```

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for development
- `npm run build:prod` - Build for production
- `npm test` - Run unit tests

## Technologies Used

- Angular 17
- TypeScript
- ECharts
- Chart.js (ng2-charts)
- Highcharts
- Angular Gridster2
- RxJS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.