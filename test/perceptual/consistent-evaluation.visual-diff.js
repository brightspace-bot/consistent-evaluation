const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-consistent-evaluation', () => {

	const visualDiff = new VisualDiff('consistent-evaluation', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-GB']
		});
		page = await browser.newPage();
		await page.setViewport({width: 900, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/test/perceptual/consistent-evaluation.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
		await visualDiff.disableAnimations(page);
	});

	after(async() => await browser.close());

	it.skip('renders the full app', async function() {
		const rect = await visualDiff.getRect(page, '#default');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
