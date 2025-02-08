# Contributing to Simple Proxy

Thank you for your interest in contributing to Simple Proxy! We welcome all forms of contributions, including but not limited to:

- Bug reports
- Feature suggestions
- Code improvements
- Documentation improvements

## Development Environment Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` directory from your project folder
   - The extension icon should now appear in your Chrome toolbar

### Development Workflow

1. Start the development server with hot reload:
   ```bash
   npm run dev
   ```
   This will automatically rebuild the extension when you make changes.

2. After making changes:
   - If you're working on the popup UI, click the extension icon to see your changes
   - If you're working on background scripts, check the background page console:
     - Find the extension in `chrome://extensions/`
     - Click "background page" under "Inspect views"
   - If you're working on content scripts, check the web page console

3. Debugging Tips:
   - Use `console.log()` statements in your code for debugging
   - Chrome DevTools Components panel can be helpful for React debugging
   - Check the "Errors" button in `chrome://extensions/` for any loading errors
   - Use Chrome's Network panel to debug proxy-related issues

### Project Structure

```
simple_proxy/
├── src/                    # Source code
│   ├── background/        # Background scripts
│   ├── constants/         # Constant definitions
│   ├── models/           # Data models
│   ├── options/          # Options page components
│   ├── popup/            # Popup UI components
│   ├── services/         # Service layer
│   ├── utils/            # Shared utilities
│   └── views/            # View components
├── public/               # Static assets
├── dist/                 # Build output (generated)
└── node_modules/         # Dependencies (generated)
```

## Submitting Pull Requests

1. Ensure your code changes are based on the latest main branch
2. Create a new branch for development
3. Follow these commit message conventions:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation updates
   - style: Code style changes
   - refactor: Code refactoring
   - test: Test-related changes
   - chore: Build process or auxiliary tool changes
4. Clearly describe your changes and reasoning in the PR description

## Reporting Bugs

If you find a bug, please create an issue with the following information:

1. Bug description
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment information (Chrome version, operating system, etc.)

## Feature Requests

If you have a feature suggestion, please create an issue including:

1. Detailed feature description
2. Explanation of why this feature is needed
3. Description of your expected implementation

## Code Standards

- Follow the existing code style
- Keep code simple and clear
- Add necessary comments
- Ensure code maintainability

## License

By submitting a pull request, you agree that your contributions will be licensed under the same license as this project.

## Contact

If you have any questions, feel free to create an issue for discussion.

Thank you for your contribution!