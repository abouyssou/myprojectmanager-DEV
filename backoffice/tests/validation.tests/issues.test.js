process.env.NODE_ENV = 'test';
let app = require('../../app');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const mongoose = require('mongoose');
const userModel = require('../../models/user')
const projectModel = require('../../models/project')
const issueModel = require('../../models/issue')
const User = mongoose.model('User');
const Issue = mongoose.model('Issue');
const Project = mongoose.model('Project');
const URL_REGISTER = 'http://localhost:4200/register';
const URL_LOGIN = 'http://localhost:4200/login';
const PROJECTS_URL = 'http://localhost:4200/dashboard/projects';
const user = new User({ name: "test", email: "test@email.com", password: "password" })
const project = new Project({ title: "projectTest", description: "projectDescription" })
const issue = new Issue({
    description: "issueDescTest",
    issueID: 1,
    priorite: "testPriorite",
    difficulte: 1,
    status: "statusTest"
})


describe('Issue tests', () => {
    const driver = new Builder().forBrowser('firefox')
    .withCapabilities({'browserName': 'firefox','name':'Firefox Test','moz:webdriverClick': false,'tz':'America/Los_Angeles','build':'Firefox Build','idleTimeout':'60'})
    .build();
    it('It should register', async () => {
        await driver.get(URL_REGISTER);
        await driver.findElement(By.name('name')).sendKeys(user.name);
        await driver.findElement(By.name('email')).sendKeys(user.email);
        await driver.findElement(By.name('password')).sendKeys(user.password);
        await driver.findElement(By.id('submit')).click()
        const success = await driver.findElement(By.className("success")).isDisplayed();
        expect(success).to.equal(true);

    });

    it('It should login and add project', async () => {
        await driver.get(URL_LOGIN);
        await driver.findElement(By.name('email')).sendKeys(user.email);
        await driver.findElement(By.name('password')).sendKeys(user.password);
        await driver.findElement(By.id('submit')).click()
        const url = await driver.getCurrentUrl();
        expect(url).to.equal(PROJECTS_URL);
        await driver.findElement(By.xpath('/html/body/app-root/app-dashboard/div/div[2]/div/app-listprojets/div/div[1]/a')).click()
        await driver.findElement(By.id('title')).sendKeys(project.title);
        await driver.findElement(By.id('description')).sendKeys(project.description);
        await driver.findElement(By.css('a.btn:nth-child(4)')).click()
        const added = await driver.findElement(By.xpath('/html/body/app-root/app-dashboard/div/div[2]/div/app-listprojets/table/tbody/tr')).isDisplayed();
        expect(added).to.equal(true);
    });

    it('It should add issue', async () => {
        await driver.findElement(By.xpath('/html/body/app-root/app-dashboard/div/div[2]/div/app-listprojets/table/tbody/tr/td[1]/a')).click()
        await driver.findElement(By.css('a.btn:nth-child(2)')).click()
        await driver.findElement(By.xpath('//*[@id="description"]')).sendKeys(issue.description);
        await driver.findElement(By.xpath('//*[@id="issueID"]')).sendKeys(issue.issueID);
        await driver.findElement(By.xpath('//*[@id="priorite"]')).sendKeys(issue.priorite);
        await driver.findElement(By.xpath('//*[@id="difficulte"]')).sendKeys(issue.difficulte);
        await driver.findElement(By.xpath('//*[@id="status"]')).sendKeys(issue.status);
        await driver.findElement(By.xpath('/html/body/app-root/app-dashboard/div/div[2]/div/app-detailprojet/div[2]/div/app-root/app-issue/div[2]/div/div/fieldset/form/a')).click()
        const isPresent = await driver.findElements(By.css('.table > tbody:nth-child(3) > tr:nth-child(1)')) === undefined;
        expect(isPresent).to.equal(true);
    });

    after(async () => {
        User.remove({}, v => {
        });
        Project.remove({}, v => {
        });
        Issue.remove({}, v => {
        });
        driver.quit()

    });



});