# Ari Rusmawan Portfolio

A professional portfolio website for Ari Rusmawan - Information Technology Education specialist, Programmer, QA/QC Administrator, and Project Expeditor.

## Features

### User-Facing Features
- **Modern, Responsive Design**: Built with Next.js 15 and Tailwind CSS
- **Dark/Light Mode**: Toggle between themes with localStorage persistence
- **Hero Section**: Professional introduction with call-to-action buttons
- **About Section**: Profile information with social links
- **Education Timeline**: Academic background with detailed descriptions
- **Experience Timeline**: Work history with responsibilities
- **Skills Section**: Categorized skills with progress bars and filtering
- **Projects Portfolio**: Grid layout with project details and links
- **Contact Form**: Validated contact form with email notifications
- **SEO Optimized**: Meta tags and structured data
- **Mobile-First**: Fully responsive design for all devices

### Admin Panel Features
- **Secure Authentication**: JWT-based login system
- **Dashboard**: Overview with statistics and recent activity
- **Message Management**: View and manage contact form submissions
- **Project CRUD**: Create, read, update, and delete portfolio projects
- **Skills Management**: Add and edit technical skills with proficiency levels
- **Settings**: Configure site settings, SEO, and social links
- **File Upload**: Upload CV documents and project images
- **Role-Based Access**: Admin-only access to management features

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **File Storage**: Local filesystem with organized directories
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ari-rusmawan-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   DATABASE_URL="file:./db/custom.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Push the database schema
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Admin Access

After running the seed script, you can access the admin panel with these credentials:

- **Email**: `admin@ari-rusmawan.com`
- **Password**: `admin123456`

**Important**: Change the admin password in production by updating the database or creating a new admin user.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin panel routes
│   │   ├── api/                   # API routes
│   │   │   ├── admin/            # Admin-specific APIs
│   │   │   ├── contact/          # Contact form API
│   │   │   ├── projects/         # Projects API
│   │   │   ├── skills/           # Skills API
│   │   │   └── upload/           # File upload API
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Homepage/portfolio
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── hooks/                    # Custom React hooks
│   └── lib/
│       ├── db.ts                 # Prisma client
│       └── utils.ts              # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
├── public/
│   ├── uploads/                  # Uploaded files
│   └── logo.png                  # Portfolio logo
└── README.md
```

## Database Schema

The application uses the following main tables:

- **users**: Admin user accounts with authentication
- **profiles**: User profile information
- **education**: Academic background
- **experiences**: Work experience history
- **skills**: Technical skills with categories and proficiency
- **projects**: Portfolio projects with metadata
- **messages**: Contact form submissions
- **settings**: Site configuration and settings

## API Endpoints

### Public APIs
- `POST /api/contact` - Submit contact form
- `GET /api/projects` - Get all projects
- `GET /api/skills` - Get all skills

### Admin APIs
- `POST /api/admin/auth` - Admin login
- `DELETE /api/admin/auth` - Admin logout
- `GET /api/admin/auth/verify` - Verify authentication
- `POST /api/projects` - Create new project
- `POST /api/skills` - Create new skill
- `POST /api/upload` - Upload files (CV, images)

## Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV="production"
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t ari-rusmawan-portfolio .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

- `DATABASE_URL`: Production database connection string
- `JWT_SECRET`: Secure secret key for JWT tokens
- `NODE_ENV`: Set to "production"

## Security Considerations

1. **Change Default Credentials**: Always change the default admin password
2. **JWT Secret**: Use a strong, unique JWT secret in production
3. **File Uploads**: Validate file types and sizes
4. **Input Validation**: All user inputs are validated on both client and server
5. **Rate Limiting**: Consider implementing rate limiting for contact forms
6. **HTTPS**: Always use HTTPS in production

## Performance Optimization

- **Image Optimization**: Use Next.js Image component for automatic optimization
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Implement proper caching strategies
- **Database Optimization**: Use proper indexing and query optimization
- **CDN**: Consider using a CDN for static assets

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Keep packages up to date
2. **Database Backups**: Regular database backups
3. **Security Updates**: Monitor and apply security patches
4. **Performance Monitoring**: Track application performance
5. **Log Management**: Monitor application logs

### Database Management

```bash
# Reset database (development only)
npm run db:reset

# Generate new migration
npx prisma migrate dev --name migration-name

# Deploy migrations to production
npx prisma migrate deploy
```

## Customization

### Adding New Sections

1. Create new components in `src/components`
2. Add API routes in `src/app/api`
3. Update database schema if needed
4. Add navigation links in the main page component

### Styling Customization

- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.ts`
- Customize shadcn/ui components in `src/components/ui`

### Theme Customization

The application uses CSS custom properties for theming. Update the color variables in `globals.css`:

```css
:root {
  --primary: oklch(0.32 0.12 252.4);  /* Primary blue */
  --background: oklch(1 0 0);         /* Light background */
  /* ... other color variables */
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: ari.rusmawan@example.com
- GitHub: [Create an issue in the repository]

## Changelog

### v1.0.0
- Initial release with full portfolio functionality
- Admin panel with authentication
- Responsive design with dark/light mode
- Contact form with email notifications
- Project and skills management
- File upload capabilities