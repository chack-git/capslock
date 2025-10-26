import { test, expect } from '@playwright/test';

test.describe('Form field validations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });
    test('validate zip code', async ({ page }) => {
        const container = page.locator('#form-container-1');
        const nextButton = container.getByRole('button', { name: 'Next' });
        
        await nextButton.click();
        await expect(container).toContainText('Enter your ZIP code.');
        await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill('1234');
        await nextButton.click();
        await expect(container).toContainText('Wrong ZIP code.');
        await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill('123456');
        await nextButton.click();
        await expect(container).toContainText('Wrong ZIP code.');
    });

    test('validate email', async ({ page }) => {
        const container = page.locator('#form-container-1');
        const nextButton = container.getByRole('button', { name: 'Next' });
        const submitButton = container.getByRole('button', { name: 'Go To Estimate' });
        const emailInput = container.getByPlaceholder('Enter Your Email');
        const emailTooltipText = () => emailInput.evaluate(el => 
            (el as HTMLInputElement).validationMessage);

        await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill('99950');
        await nextButton.click();
        await container.getByText('Safety').click();
        await nextButton.click();
        await container.getByText('Rental Property').click();
        await nextButton.click();
        await submitButton.click();
        let validationMessage = await emailTooltipText();
        expect(validationMessage).toBe('Please fill out this field.');
        await emailInput.fill('invalidEmail');
        await submitButton.click();
        validationMessage = await emailTooltipText();
        expect(validationMessage).toBe("Please include an '@' in the email address. 'invalidEmail' is missing an '@'.");
        await emailInput.fill('invalidEmail@');
        await submitButton.click();
        validationMessage = await emailTooltipText();
        expect(validationMessage).toBe("Please enter a part following '@'. 'invalidEmail@' is incomplete.");
            await emailInput.fill('invalidEmail@test');
        await submitButton.click();
        validationMessage = await emailTooltipText();
        //this assertion fails due incorrect email validation message
        expect(validationMessage).toBe("Please enter a proper domain name after the '@'. 'invalidEmail@test' is incorrect.");
    });

    test('validate phone number', async ({ page }) => {
        const container = page.locator('#form-container-1');
        const nextButton = container.getByRole('button', { name: 'Next' });
        const estimateButton = container.getByRole('button', { name: 'Go To Estimate' });
        const nameInput = container.getByPlaceholder('Enter Your Name');
        const phoneInput = container.getByPlaceholder('(XXX)XXX-XXXX');
        const submitButton = container.getByRole('button', { name: 'Submit Your Request' });

        await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill('99950');
        await nextButton.click();
        await container.getByText('Safety').click();
        await nextButton.click();
        await container.getByText('Rental Property').click();
        await nextButton.click();
        await container.getByRole('textbox', { name: 'Enter Your Email' }).fill('test@test.com');
        await nameInput.fill('Test test');
        await estimateButton.click();
        await submitButton.click();
        await expect(container).toContainText('Enter your phone number.');
        await phoneInput.fill('23456789');
        await submitButton.click();
        await expect(container).toContainText('Wrong phone number.');
    });

    //there no functional requirement for name validation, but added this test as an extra one
    test('validate name', async ({ page }) => {
        const container = page.locator('#form-container-1');
        const nextButton = container.getByRole('button', { name: 'Next' });
        const submitButton = container.getByRole('button', { name: 'Go To Estimate' });
        const nameInput = container.getByPlaceholder('Enter Your Name');

        await container.getByRole('textbox', { name: 'Enter ZIP Code' }).fill('99950');
        await nextButton.click();
        await container.getByText('Safety').click();
        await nextButton.click();
        await container.getByText('Rental Property').click();
        await nextButton.click();
        await container.getByRole('textbox', { name: 'Enter Your Email' }).fill('test@test.com');
        await submitButton.click();
        await expect(container).toContainText('Please enter your name.');
        await nameInput.fill('Test');
        await submitButton.click();
        await expect(container).toContainText('Your full name should contain both first and last name.');
    });
});