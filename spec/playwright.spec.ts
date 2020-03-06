import * as playwright from 'playwright';
import { actorCalled, actorInTheSpotlight, ArtifactArchiver, configure } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { BrowseTheWeb, CloseBrowser, Navigate, OpenBrowser, TakeScreenshot } from '../src';

configure({
    crew: [
        ConsoleReporter.forDarkTerminals(),
        ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
        new SerenityBDDReporter(),
    ]
});

describe('playwright', () => {

    // example from Playwright docs
    it('works', (async () => {
        const browser = await playwright.chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('http://whatsmyuseragent.org/');
        await page.screenshot({ path: `example-chromium.png` });
        await browser.close();
    }));

    // Jan hacking same thing in Screenplay :-]
    describe('integrated with Serenity/JS', () => {

        for (const browserType of ['chromium', 'firefox', 'webkit']) {

            it(`works with screenplay (${browserType})`, () =>
                actorCalled('William')
                    .whoCan(BrowseTheWeb.using(playwright[browserType]))
                    .attemptsTo(
                        OpenBrowser(),
                        Navigate.to(`http://whatsmyuseragent.org/`),
                        TakeScreenshot.of('the page'),
                    ),
            );
        }

        afterEach(() => actorInTheSpotlight().attemptsTo(
            // todo: closing the browser should be done automatically by the Stage
            CloseBrowser(),
        ))
    });
});
