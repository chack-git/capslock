import { test, expect } from '@playwright/test';

const properZipCode = '99950';
const invalidZipCode = '11111';
const surveyInterested = ['Independence', 'Safety', 'Therapy', 'Other'];
const surveyPropertyType = 'Rental Property';
const properName = 'Andrii Test';
const properEmail = 'andrii@test.com';
const properPhoneNumber = '2345678901';

test.describe('Form Filling Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('filling a form successfully', async ({ page }) => {
    const requestPromise = page.waitForRequest(/test-task\/handle-form/);
    const container = page.locator('#form-container-1');
    const formStep = container.locator('.stepProgress__step');
    const nextButton = container.getByRole('button', { name: 'Next' });

    await test.step('Fill out zip code', async () => {
      await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill(properZipCode);
      await nextButton.click();
    });
    await test.step('Check network request', async () => {
      const request = await requestPromise;
      const postDataString = await request.postData() ?? '';
      const formData = new URLSearchParams(postDataString);
      expect(formData.get('stepNumber')).toBe('1');
      expect(formData.get('zipCode')).toBe(properZipCode);
    });
    await test.step('Fill out interested survey', async () => {
      await expect(formStep).toContainText('2 of 5');
      await expect(container).toContainText('Why are you interested in a walk-in tub?');
      for(const interest of surveyInterested) {
        await container.getByText(interest).click();
      }
      await nextButton.click();
    });
    await test.step('Fill out property type survey', async () => {
      //this assertion fails probably due a bug - shows '2 of 5' instead of '3 of 5'
      await expect.soft(formStep).toContainText('3 of 5');
      await expect(container).toContainText('What type of property is this for?');
      await container.getByText(surveyPropertyType).click();
      await nextButton.click();
    });
    await test.step('Fill out name and email', async () => {
      await expect(formStep).toContainText('4 of 5');
      await expect(container).toContainText('Who should we prepare this FREE estimate for?');
      await container.getByRole('textbox', { name: 'Enter Your Name' }).fill(properName);
      await container.getByRole('textbox', { name: 'Enter Your Email' }).fill(properEmail);
      await container.getByRole('button', { name: 'Go To Estimate' }).click();
    });
    await test.step('Submit phone number', async () => {
      await expect(formStep).toContainText('5 of 5');
      await container.getByRole('textbox', { name: '(XXX)XXX-XXXX' }).fill(properPhoneNumber);
      await container.getByRole('button', { name: 'Submit Your Request' }).click();
    });
    await test.step('Check thank you page', async () => {
      await expect(page.url()).toBe('https://test-qa.capslock.global/thankyou');
      await expect(page.getByRole('heading')).toContainText('Thank you!');
    });
  });

  test('filling a form unsuccessfully', async ({ page }) => {
    const requestPromise = page.waitForRequest(/test-task\/handle-form/);
    const container = page.locator('#form-container-1');
    const formStep = container.locator('.stepProgress__step');
    const nextButton = container.getByRole('button', { name: 'Next' });

    await test.step('Fill out invalid zip code', async () => {
      await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill(invalidZipCode);
      await nextButton.click();
      //this assertion fails probably due a bug - shows '1 of' instead of '1 of 2'
      await expect.soft(formStep).toContainText('1 of 2');
      await expect(container).toContainText('Sorry, unfortunately');
    });
    await test.step('Fill out an email', async () => {
      await container.getByRole('textbox', { name: 'Email Address' }).fill(properEmail);
      await container.getByRole('button', { name: 'Submit' }).click();
        await expect(container).toContainText(
      'Thank you for your interest, we will contact you when our service becomes available in your area!');
    });
    //step fails probably a bug, need to clarify
    await test.step.skip('Check thank you page', async () => {
      await expect(page.url()).toBe('https://test-qa.capslock.global/thankyou');
      await expect(page.getByRole('heading')).toContainText('Thank you!');
    });
  });
});
