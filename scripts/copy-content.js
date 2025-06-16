import { cpSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '..', 'src', 'content');
const targetDir = join(__dirname, '..', '.vercel', 'output', 'functions', 'content');

try {
	// Create target directory if it doesn't exist
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	// Copy content directory
	if (existsSync(sourceDir)) {
		cpSync(sourceDir, targetDir, { recursive: true });
		console.log('✅ Content files copied successfully');
		console.log('Dir:', join(process.cwd(), 'src/content/blog'));
		console.log('Content:', readdirSync(join(process.cwd(), 'src/content/blog')));
	} else {
		console.log('⚠️  Source content directory not found');
	}
} catch (error) {
	console.error('❌ Error copying content files:', error);
	process.exit(1);
}
