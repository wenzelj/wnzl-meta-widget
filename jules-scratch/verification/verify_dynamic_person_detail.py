from playwright.sync_api import sync_playwright, expect
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        extra_http_headers={"Cache-Control": "no-cache, no-store, must-revalidate"}
    )
    page = context.new_page()

    # Get the absolute path to the Index.html file
    file_path = os.path.abspath('Index.html')
    page.goto(f'file://{file_path}')

    # --- Step 1: Add a new property to the schema ---
    page.click('button:has-text("Add To Schema")')

    # Select the 'person' schema
    page.select_option('select#schemaSelect', 'person')

    # Add a new property
    page.fill('input[ng-model="$ctrl.newProperty.name"]', 'customField')
    page.click('button:has-text("Add Property")')
    page.click('button:has-text("Save All Changes")')

    # Go back home
    page.click('button:has-text("Home")')

    # --- Step 2: Create a new person with the custom field ---
    page.click('button:has-text("Add New Person")')

    # Fill in the person details
    page.fill('input[ng-model="person.firstname"]', 'John')
    page.fill('input[ng-model="person.surname"]', 'Doe')
    page.fill('input[ng-model="person.age"]', '30')
    # The custom field should be present
    page.fill('input[ng-model="person.customField"]', 'Custom Value')
    page.click('button:has-text("Next")')

    # Fill in the address
    page.fill('input[ng-model="person.address.street"]', '123 Main St')
    page.fill('input[ng-model="person.address.city"]', 'Anytown')
    page.fill('input[ng-model="person.address.postcode"]', '12345')
    page.click('button:has-text("Next")')

    # Add a child
    page.fill('input[ng-model="newChild.name"]', 'Jane Doe')
    page.fill('input[ng-model="newChild.age"]', '5')
    page.click('button:has-text("Add Child")')

    # Save the person
    page.click('button:has-text("Save")')
    # Go back to landing page
    page.click('button:has-text("Start Over")')


    # --- Step 3: Search for the person and verify the details ---
    page.fill('input[ng-model="search.term"]', 'John')
    page.click('button:has-text("Search")')

    # Click on the search result
    page.click('a:has-text("John Doe")')

    # --- Step 4: Take a screenshot ---
    # Wait for the details to appear
    expect(page.locator('h3:has-text("Selected Person Details")')).to_be_visible()

    # Take a screenshot of the person details
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
