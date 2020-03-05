import { Ability, Interaction, UsesAbilities } from '@serenity-js/core';
import { Browser, BrowserContext, BrowserType, Page } from 'playwright';
import { Name, Photo } from '@serenity-js/core/lib/model';

export class BrowseTheWeb implements Ability {
    private instance: Browser;
    private context: BrowserContext;
    private page: Page;

    static using(browser: BrowserType) {
        return new BrowseTheWeb(browser);
    }

    static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.abilityTo(BrowseTheWeb);
    }

    constructor(private readonly browser: BrowserType) {
    }

    async open() {
        this.instance = await this.browser.launch();
        this.context = await this.instance.newContext();
        this.page = await this.context.newPage();
    }

    async close() {
        // this doesn't work yet...
        // await (this.browser as any).close()
    }

    async navigateTo(url: string) {
        return await this.page.goto(url);
    }

    takeScreenshot() {
        return this.page.screenshot();
    }
}

export const OpenBrowser = () =>
    Interaction.where(`#actor opens the browser`, async (actor) =>
        BrowseTheWeb.as(actor).open()
    );

export const CloseBrowser = () =>
    Interaction.where(`#actor closes the browser`, async (actor) =>
        BrowseTheWeb.as(actor).close()
    );

export const TakeScreenshot = {
    of: (name: string) =>
        Interaction.where(`#actor takes a screenshot of ${ name }`, async (actor) => {
            const screenshot = await BrowseTheWeb.as(actor).takeScreenshot();

            await actor.collect(
                Photo.fromBase64(screenshot.toString('base64')),
                new Name(name),
            )
        }),
};

export const Navigate = {
    to: (url: string) =>
        Interaction.where(`#actor navigates to ${ url }`, async (actor) => {
            await BrowseTheWeb.as(actor).navigateTo(url);
        }),
};
