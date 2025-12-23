# Lules Market - Complete Test Plan

## Application Overview

Lules Market is a local commerce marketplace platform that connects buyers with local merchants. The application allows customers to browse products and businesses, and enables merchants to register their businesses, manage products, view statistics, and handle their online storefronts. The platform includes authentication, product management, business profiles, search and filtering capabilities, and plan management for different subscription tiers.

## Test Scenarios

### 1. Authentication & Account Management

**Seed:** `e2e/seed.spec.ts`

#### 1.1. User Registration Flow - New Merchant

**File:** `tests/auth/signup-merchant.spec.ts`

**Steps:**
  1. Navigate to home page
  2. Click on 'Para comercios' link in header
  3. Click on 'Registrar Comercio' or 'Registrate aquí' link
  4. Verify signup form displays with email and password fields
  5. Enter valid email address in email field
  6. Enter password in password field (minimum 8 characters with uppercase, lowercase, numbers)
  7. Enter password confirmation in confirm password field
  8. Accept terms and conditions checkbox if present
  9. Click 'Crear Cuenta' or register button
  10. Verify success message or redirect to business setup page

**Expected Results:**
  - Form displays correctly with all required fields
  - Email field accepts valid email format
  - Password field masks input for security
  - Password confirmation field is validated
  - Terms and conditions can be accepted
  - Account is created successfully
  - User is redirected to business setup or confirmation page
  - Success message or toast notification appears

#### 1.2. User Login - Valid Credentials

**File:** `tests/auth/signin-valid.spec.ts`

**Steps:**
  1. Navigate to signin page directly or via 'Iniciar Sesión' link
  2. Verify signin form displays with email and password fields
  3. Enter registered merchant email in email field
  4. Enter correct password in password field
  5. Click 'Iniciar Sesión' button
  6. Verify redirect to dashboard or business control panel
  7. Verify user name or business name appears in header/dashboard
  8. Verify welcome message or greeting appears

**Expected Results:**
  - Signin page loads successfully
  - Email field accepts valid email format
  - Password field is properly masked
  - Authentication is successful
  - User is redirected to dashboard
  - User session is created
  - Navigation menu changes to show authenticated user options
  - Dashboard displays user/business information

#### 1.3. User Login - Invalid Credentials

**File:** `tests/auth/signin-invalid.spec.ts`

**Steps:**
  1. Navigate to signin page
  2. Enter valid email format but non-existent account
  3. Enter any password
  4. Click 'Iniciar Sesión' button
  5. Verify error message appears
  6. Verify user is NOT logged in and stays on signin page

**Expected Results:**
  - Error message displays indicating invalid credentials
  - User is not authenticated
  - Page does not redirect to dashboard
  - Error message is user-friendly and informative

#### 1.4. Password Reset Flow

**File:** `tests/auth/password-reset.spec.ts`

**Steps:**
  1. Navigate to signin page
  2. Click '¿Olvidaste tu contraseña?' link
  3. Verify password reset form displays
  4. Enter registered email address
  5. Click 'Enviar enlace de recuperación' or submit button
  6. Verify confirmation message about reset email
  7. Check email for reset link (in test environment)
  8. Click reset link from email
  9. Verify password reset form displays with new password fields
  10. Enter new password
  11. Enter password confirmation
  12. Click 'Restablecer Contraseña' button
  13. Verify success message
  14. Verify ability to login with new password

**Expected Results:**
  - Password reset page loads
  - Email form accepts input
  - Reset email is sent
  - Confirmation message displays
  - Reset link in email is valid
  - New password form displays with validation
  - Password is updated successfully
  - Login works with new credentials
  - Old password no longer works

#### 1.5. User Logout

**File:** `tests/auth/logout.spec.ts`

**Steps:**
  1. Authenticate as a merchant user
  2. Navigate to dashboard or authenticated page
  3. Locate logout button/option in header or menu
  4. Click logout button
  5. Verify redirect to home page or login page
  6. Verify user session is cleared
  7. Verify dashboard is no longer accessible
  8. Attempt to navigate to protected route
  9. Verify redirect to signin page

**Expected Results:**
  - User is successfully logged out
  - Session is terminated
  - Navigation menu changes to show unauthenticated state
  - Protected pages are inaccessible
  - Redirect to signin occurs when accessing protected content

### 2. Home Page & Public Navigation

**Seed:** `e2e/seed.spec.ts`

#### 2.1. Home Page Loads Successfully

**File:** `tests/public/home-page-load.spec.ts`

**Steps:**
  1. Navigate to home page (root URL)
  2. Verify page title is 'Lules Market - Tu Vitrina Digital para Comercios Locales'
  3. Verify header with logo and navigation menu displays
  4. Verify search bar for products displays
  5. Verify main hero section displays with call-to-action buttons
  6. Verify statistics section showing active businesses and published products
  7. Verify featured businesses section displays at least 6 businesses
  8. Verify recent products section displays products with images and prices
  9. Verify footer with links and copyright

**Expected Results:**
  - Page loads within acceptable time
  - All major sections render correctly
  - Logo is visible and clickable
  - Navigation menu items are visible
  - Search functionality is accessible
  - Hero section displays with calls-to-action
  - Statistics display current data
  - Product cards show images, names, prices, and discount info
  - Business cards show names, categories, and descriptions
  - Footer displays with all sections

#### 2.2. Main Navigation Menu

**File:** `tests/public/navigation-menu.spec.ts`

**Steps:**
  1. Navigate to home page
  2. Verify navigation menu displays: Inicio, Productos, Comercios, Planes, Preguntas Frecuentes
  3. Click 'Inicio' link
  4. Verify navigation to home page
  5. Click 'Productos' link
  6. Verify navigation to products exploration page
  7. Click 'Comercios' link
  8. Verify navigation to businesses exploration page
  9. Click 'Planes' link
  10. Verify navigation to plans page
  11. Click 'Preguntas Frecuentes' link
  12. Verify navigation to FAQ page

**Expected Results:**
  - All navigation links are visible
  - All links are functional
  - Navigation correctly routes to respective pages
  - Page content changes according to clicked link
  - Active page indicator shows current page

#### 2.3. Header Search Functionality

**File:** `tests/public/header-search.spec.ts`

**Steps:**
  1. Navigate to home page
  2. Locate search bar in header
  3. Click on search input field
  4. Type a product keyword (e.g., 'laptop', 'comida')
  5. Press Enter or click search button
  6. Verify navigation to products page with search results
  7. Verify search results filtered by keyword
  8. Verify number of results displayed
  9. Try searching with empty input
  10. Verify error handling or default results

**Expected Results:**
  - Search bar is accessible and clickable
  - Search input accepts text
  - Search executes on Enter or button click
  - Results page displays filtered products
  - Search highlighting or indication of active search
  - Empty search handled gracefully
  - Results load within reasonable time

#### 2.4. Footer Links Navigation

**File:** `tests/public/footer-navigation.spec.ts`

**Steps:**
  1. Navigate to home page
  2. Scroll to footer
  3. Verify footer sections: Plataforma, Comercio, Legal
  4. Click on 'Explorar Productos' under Plataforma
  5. Verify navigation to products page
  6. Navigate back to home page
  7. Click on 'Explorar Comercios' under Plataforma
  8. Verify navigation to businesses page
  9. Click on 'Planes' under Plataforma
  10. Verify navigation to plans page
  11. Click on 'Registrar Comercio' under Comercio
  12. Verify navigation to signup page
  13. Navigate back
  14. Click on 'Iniciar Sesión' under Comercio
  15. Verify navigation to signin page
  16. Navigate back
  17. Click on 'Política de Privacidad' under Legal
  18. Verify navigation to privacy policy page

**Expected Results:**
  - All footer links are visible and clickable
  - Links navigate to correct pages
  - Footer content is readable
  - No broken links
  - Links open in same tab or new tab as appropriate

### 3. Products Exploration

**Seed:** `e2e/seed.spec.ts`

#### 3.1. Browse All Products

**File:** `tests/products/browse-all.spec.ts`

**Steps:**
  1. Navigate to home page
  2. Click 'Ver Productos' button in hero section
  3. Verify products page loads
  4. Verify multiple product cards display with images, names, prices
  5. Verify discount percentages display where applicable
  6. Verify business names and verification badges display
  7. Verify pagination or infinite scroll functionality
  8. Scroll down to load more products
  9. Verify additional products load correctly

**Expected Results:**
  - Products page loads successfully
  - Product grid or list displays correctly
  - All product card elements render
  - Images load without errors
  - Prices display in correct currency format
  - Business information displays accurately
  - Pagination/infinite scroll works
  - No duplicate products in view

#### 3.2. Product Search and Filter

**File:** `tests/products/search-filter.spec.ts`

**Steps:**
  1. Navigate to products page
  2. Use search input to search for specific product category
  3. Verify search results filter correctly
  4. Verify filter options display (if available): price range, category, business, rating
  5. Apply price filter (e.g., min $100, max $500)
  6. Verify products in result range match filter
  7. Apply category filter
  8. Verify only selected category products display
  9. Clear all filters
  10. Verify all products display again
  11. Apply multiple filters together
  12. Verify results respect all applied filters

**Expected Results:**
  - Search executes successfully
  - Filter options are accessible
  - Each filter narrows results appropriately
  - Multiple filters work together
  - Results update in real-time or after filter submission
  - Clear filters restores full product list
  - Filter UI provides clear feedback of active filters

#### 3.3. Product Detail Page

**File:** `tests/products/product-detail.spec.ts`

**Steps:**
  1. Navigate to products page
  2. Click on a product card
  3. Verify product detail page loads
  4. Verify product image gallery displays (main image and thumbnails if available)
  5. Verify product name and description displays
  6. Verify pricing information (original price, discount price, discount percentage)
  7. Verify product category and tags display
  8. Verify business information and link displays
  9. Verify business verification badge displays
  10. Verify contact information or WhatsApp link displays
  11. Verify product availability status if applicable
  12. Verify rating or reviews section if applicable

**Expected Results:**
  - Product detail page loads correctly
  - All product information displays accurately
  - Images are clear and properly sized
  - Pricing calculations are correct
  - Business link is clickable and functional
  - Contact information is present and actionable
  - Page responsiveness on mobile and desktop

#### 3.4. Product Sorting and Pagination

**File:** `tests/products/sorting-pagination.spec.ts`

**Steps:**
  1. Navigate to products page
  2. Verify sort options available (price low-high, price high-low, newest, relevance, ratings)
  3. Click 'Price: Low to High' sort option
  4. Verify products are sorted by price ascending
  5. Click 'Price: High to Low' sort option
  6. Verify products are sorted by price descending
  7. Click 'Newest' or 'Recently Added' sort option
  8. Verify products sorted by date
  9. Navigate to next page of results
  10. Verify different products display
  11. Verify page number updates
  12. Navigate to previous page
  13. Verify products from previous page display again
  14. Click last page button
  15. Verify last page of results displays

**Expected Results:**
  - Sort options display correctly
  - Each sort option orders products correctly
  - Sort selection persists when changing pages
  - Pagination controls are visible and functional
  - Page indicators show current page
  - Forward/backward navigation works
  - Product order is consistent with selected sort

### 4. Business Exploration

**Seed:** `e2e/seed.spec.ts`

#### 4.1. Browse All Businesses

**File:** `tests/businesses/browse-all.spec.ts`

**Steps:**
  1. Navigate to home page
  2. Click 'Explorar Comercios' button or link
  3. Verify businesses page loads
  4. Verify multiple business cards display
  5. Verify each business card shows: name, category, description, address
  6. Verify business image/logo displays
  7. Verify verification badge displays for verified businesses
  8. Verify rating or review count if applicable
  9. Scroll to load more businesses
  10. Verify additional businesses load

**Expected Results:**
  - Businesses page loads successfully
  - Business grid displays correctly
  - All business card elements render
  - Images/logos load properly
  - Business information is accurate
  - Pagination/infinite scroll works
  - No duplicate businesses in view

#### 4.2. Business Search and Filter

**File:** `tests/businesses/search-filter.spec.ts`

**Steps:**
  1. Navigate to businesses page
  2. Use search to find business by name
  3. Verify search results filter to matching businesses
  4. Verify filter options display: category, rating, verification status, location
  5. Apply category filter (e.g., 'Tecnología', 'Vestimenta')
  6. Verify only selected category businesses display
  7. Apply verification status filter (Verified only)
  8. Verify only verified businesses display
  9. Apply multiple filters together
  10. Verify results respect all filters
  11. Clear filters and verify all businesses display

**Expected Results:**
  - Search returns matching businesses
  - Category filter narrows results correctly
  - Verification filter works
  - Multiple filters work together
  - Filter UI shows active filters clearly
  - Clear action resets all filters

#### 4.3. Business Detail Page

**File:** `tests/businesses/business-detail.spec.ts`

**Steps:**
  1. Navigate to businesses page
  2. Click on a business card
  3. Verify business detail page loads
  4. Verify business name and logo/image displays
  5. Verify business description and category displays
  6. Verify business address and location information displays
  7. Verify contact information (phone, email, WhatsApp) if available
  8. Verify verification badge and status displays
  9. Verify rating and review section if applicable
  10. Verify products section showing business's products
  11. Verify 'View All Products' link to filter products by this business
  12. Verify operating hours if available
  13. Verify payment methods accepted if displayed

**Expected Results:**
  - Business detail page loads successfully
  - All business information displays correctly
  - Business image displays properly
  - Contact information is present and clickable
  - Products section shows relevant items
  - Navigation to business products works
  - Verification status is clear
  - Page is responsive and readable

### 5. Business Management Dashboard

**Seed:** `e2e/seed.spec.ts`

#### 5.1. Dashboard Access and Layout

**File:** `tests/dashboard/dashboard-access.spec.ts`

**Steps:**
  1. Authenticate as a merchant user
  2. Click on 'Panel de Control' or navigate to /dashboard
  3. Verify dashboard page loads with 'Panel de Control' heading
  4. Verify dashboard displays main sections: statistics, recent activity, navigation
  5. Verify sidebar or main menu displays for dashboard navigation
  6. Verify user/business name appears in header
  7. Verify logout option is accessible
  8. Verify responsive layout on mobile and desktop

**Expected Results:**
  - Dashboard loads successfully after authentication
  - All main sections render correctly
  - Statistics are displayed (active products, views, sales if applicable)
  - Navigation menu is clear and organized
  - User is clearly identified
  - Logout is easily accessible
  - Layout adapts to different screen sizes

#### 5.2. Product Management - Create Product

**File:** `tests/dashboard/create-product.spec.ts`

**Steps:**
  1. Authenticate and navigate to dashboard
  2. Locate 'Add Product', 'Create Product', or 'New Product' button
  3. Click to open product creation form
  4. Verify form displays with fields: name, description, price, category, images
  5. Enter product name
  6. Enter product description
  7. Enter original price
  8. Enter sale price (if applicable for discount)
  9. Select product category from dropdown
  10. Upload product image(s)
  11. Verify image preview displays
  12. Check availability checkbox if applicable
  13. Enter stock quantity if applicable
  14. Click 'Save', 'Publish', or 'Create Product' button
  15. Verify success message or redirect to product list
  16. Verify new product appears in business product list

**Expected Results:**
  - Product creation form loads
  - All required fields are present
  - Form fields accept appropriate input
  - Image upload works correctly
  - Image preview displays
  - Form validation works
  - Product is created successfully
  - Product appears in product list/dashboard
  - Product is publicly visible on business page

#### 5.3. Product Management - Edit Product

**File:** `tests/dashboard/edit-product.spec.ts`

**Steps:**
  1. Authenticate and navigate to dashboard
  2. Navigate to products or inventory management section
  3. Locate a product in the list
  4. Click 'Edit', 'Modify', or product name to edit
  5. Verify edit form loads with existing product data
  6. Modify product name
  7. Modify product description
  8. Modify pricing
  9. Modify category
  10. Update product image if desired
  11. Click 'Save', 'Update', or 'Guardar Cambios' button
  12. Verify success message
  13. Verify changes appear in product list
  14. Verify changes are visible on public product page

**Expected Results:**
  - Edit form loads with current data
  - All fields are editable
  - Changes save successfully
  - Updated information reflects in product list
  - Public view shows updated information
  - Success notification appears
  - No data loss during edit process

#### 5.4. Product Management - Delete Product

**File:** `tests/dashboard/delete-product.spec.ts`

**Steps:**
  1. Authenticate and navigate to dashboard
  2. Navigate to products section
  3. Locate a product to delete
  4. Click 'Delete', 'Remove', or trash icon
  5. Verify confirmation dialog appears asking to confirm deletion
  6. Click 'Cancel' on confirmation dialog
  7. Verify product is NOT deleted and remains in list
  8. Locate same product again
  9. Click delete button again
  10. Click 'Confirm' or 'Delete' on confirmation dialog
  11. Verify success message
  12. Verify product is removed from list
  13. Verify product is no longer visible on public pages

**Expected Results:**
  - Delete action prompts for confirmation
  - Cancel action prevents deletion
  - Confirm action deletes product
  - Product disappears from dashboard
  - Product disappears from public view
  - Success message confirms deletion
  - No accidental deletions without confirmation

#### 5.5. Business Information Management

**File:** `tests/dashboard/edit-business.spec.ts`

**Steps:**
  1. Authenticate and navigate to dashboard
  2. Locate 'Business Settings', 'Profile Settings', or 'Business Info' section
  3. Click to access business information edit form
  4. Verify form displays with: business name, description, category, contact info
  5. Modify business name
  6. Modify business description
  7. Modify contact phone/WhatsApp number
  8. Upload or change business logo/image
  9. Update business address/location
  10. Modify business website if applicable
  11. Click 'Save' or 'Guardar Cambios' button
  12. Verify success message
  13. Verify changes appear on public business page

**Expected Results:**
  - Business settings form loads
  - All editable fields are present
  - Form accepts valid input
  - Image upload works
  - Changes save successfully
  - Public profile reflects updates
  - Success notification appears
  - Contact information is validated

### 6. Error Handling & Edge Cases

**Seed:** `e2e/seed.spec.ts`

#### 6.1. Invalid Email Signup Validation

**File:** `tests/errors/invalid-email-signup.spec.ts`

**Steps:**
  1. Navigate to signup page
  2. Try to submit form with invalid email formats:
  3.   - No @ symbol
  4.   - Multiple @ symbols
  5.   - Missing domain
  6.   - Special characters that are invalid
  7. Verify error message displays for each invalid format
  8. Verify form does not submit
  9. Enter valid email and verify it's accepted

**Expected Results:**
  - Email validation is enforced
  - Clear error messages for invalid emails
  - Form prevents submission with invalid email
  - Valid email format is accepted
  - Real-time validation feedback

#### 6.2. Weak Password Validation

**File:** `tests/errors/weak-password.spec.ts`

**Steps:**
  1. Navigate to signup page
  2. Enter email
  3. Try passwords that are too weak:
  4.   - Less than 8 characters
  5.   - Only lowercase letters
  6.   - Only numbers
  7.   - No special characters if required
  8. Verify error messages for weak passwords
  9. Enter a strong password meeting requirements
  10. Verify strong password is accepted

**Expected Results:**
  - Password strength requirements are enforced
  - Clear error messages for weak passwords
  - Requirements are displayed to user
  - Strong passwords are accepted
  - Real-time validation feedback

#### 6.3. Password Mismatch on Signup

**File:** `tests/errors/password-mismatch.spec.ts`

**Steps:**
  1. Navigate to signup page
  2. Enter email
  3. Enter password in first field
  4. Enter different password in confirmation field
  5. Attempt to submit form
  6. Verify error message about password mismatch
  7. Verify form does not submit
  8. Enter matching passwords
  9. Verify form can be submitted

**Expected Results:**
  - Password confirmation is validated
  - Mismatch error displays clearly
  - Form prevents submission on mismatch
  - Matching passwords are accepted
  - Real-time validation feedback

#### 6.4. Duplicate Email Registration

**File:** `tests/errors/duplicate-email.spec.ts`

**Steps:**
  1. Authenticate as existing merchant and note their email
  2. Logout
  3. Navigate to signup page
  4. Enter the same email as existing merchant
  5. Enter password and submit form
  6. Verify error message about email already in use
  7. Verify account is not created
  8. Try with a different email
  9. Verify registration succeeds with new email

**Expected Results:**
  - Duplicate email validation works
  - Clear error message about existing email
  - Prevents duplicate account creation
  - Unique email registration succeeds
  - Error handling is user-friendly

#### 6.5. Missing Required Fields

**File:** `tests/errors/missing-fields.spec.ts`

**Steps:**
  1. Navigate to signup page
  2. Try to submit form with empty email field
  3. Verify error message for missing email
  4. Enter email but skip password
  5. Try to submit
  6. Verify error message for missing password
  7. Enter both email and password, submit
  8. Verify form submits successfully

**Expected Results:**
  - Required field validation is enforced
  - Clear error messages for missing fields
  - Form highlights empty required fields
  - Complete form submits successfully
  - No silent failures

#### 6.6. Product Creation Missing Fields

**File:** `tests/errors/product-missing-fields.spec.ts`

**Steps:**
  1. Authenticate and navigate to create product form
  2. Try to submit without filling required fields
  3. Verify error messages appear
  4. Fill required fields one by one
  5. Verify errors clear as fields are filled
  6. Complete all required fields and submit
  7. Verify product is created successfully

**Expected Results:**
  - Required field validation works
  - Error messages appear for empty fields
  - Fields highlight when empty
  - Errors clear when field is filled
  - Complete form submits successfully

#### 6.7. Image Upload Validation

**File:** `tests/errors/image-validation.spec.ts`

**Steps:**
  1. Navigate to create or edit product form
  2. Locate image upload field
  3. Try to upload non-image file (txt, pdf)
  4. Verify error message about file type
  5. Try to upload very large image file
  6. Verify error about file size if applicable
  7. Upload valid image file (jpg, png)
  8. Verify image preview displays
  9. Verify image uploads successfully

**Expected Results:**
  - File type validation works
  - Only image files are accepted
  - File size limits are enforced if applicable
  - Clear error messages for invalid files
  - Valid images upload successfully
  - Image preview displays correctly

#### 6.8. Network Error Handling

**File:** `tests/errors/network-error.spec.ts`

**Steps:**
  1. With page loaded, trigger offline mode
  2. Try to click a navigation link
  3. Verify error message about connectivity
  4. Try to submit a form
  5. Verify error message about connection
  6. Restore online connection
  7. Verify navigation works again
  8. Verify form submission works

**Expected Results:**
  - Offline state is detected
  - User-friendly error messages display
  - Functionality gracefully degrades
  - When online again, functionality is restored
  - No data loss or corruption

#### 6.9. 404 Page Not Found

**File:** `tests/errors/404-page.spec.ts`

**Steps:**
  1. Navigate to non-existent URL (e.g., /invalid-page-xyz)
  2. Verify 404 error page or message displays
  3. Verify helpful message about page not found
  4. Verify navigation back to home page link
  5. Click home link
  6. Verify navigation back to home succeeds

**Expected Results:**
  - 404 page displays for non-existent routes
  - Clear error message
  - Navigation back to home is available
  - Link is functional

#### 6.10. Unauthorized Access Protection

**File:** `tests/errors/unauthorized-access.spec.ts`

**Steps:**
  1. With no authentication, try to access /dashboard directly
  2. Verify redirect to signin page
  3. Try to access /business-setup
  4. Verify redirect to signin or appropriate auth flow
  5. Authenticate as merchant
  6. Verify dashboard is now accessible
  7. Verify business info is accessible

**Expected Results:**
  - Protected routes redirect unauthenticated users
  - Redirect is to signin page
  - Authenticated users can access protected routes
  - Session-based protection works
  - No unauthorized access to protected content

### 7. Plans & Pricing

**Seed:** `e2e/seed.spec.ts`

#### 7.1. Plans Page Display

**File:** `tests/plans/plans-display.spec.ts`

**Steps:**
  1. Navigate to Plans page via navigation or footer link
  2. Verify plans page loads successfully
  3. Verify heading about subscription plans displays
  4. Verify multiple plan cards display (Free, Basic, Premium, etc.)
  5. Verify each plan card shows: name, price, features list
  6. Verify call-to-action buttons for each plan (e.g., 'Select Plan', 'Upgrade')
  7. Verify current plan is highlighted if user is authenticated
  8. Scroll through all available plans

**Expected Results:**
  - Plans page loads correctly
  - All plan tiers display
  - Pricing is clearly shown
  - Features are listed for each plan
  - Call-to-action buttons are prominent
  - Plan comparison is easy
  - Responsive design on all devices

#### 7.2. Plan Selection as Unauthenticated User

**File:** `tests/plans/plan-selection-unauthenticated.spec.ts`

**Steps:**
  1. Navigate to Plans page without authenticating
  2. Click 'Select Plan' or upgrade button for a plan
  3. Verify redirect to signin/signup page
  4. Verify reference to selected plan is retained or user understands context
  5. Complete signup
  6. Verify new user account is set up with selected plan if applicable

**Expected Results:**
  - Unauthenticated users are redirected to auth
  - Signin/signup process is initiated
  - Plan selection context is preserved if possible
  - User can complete registration after plan selection

#### 7.3. Plan Upgrade from Dashboard

**File:** `tests/plans/plan-upgrade.spec.ts`

**Steps:**
  1. Authenticate as merchant on Free or lower tier plan
  2. Navigate to dashboard settings or billing section
  3. Locate upgrade option or subscription management
  4. View current plan and available upgrades
  5. Click to upgrade to higher tier plan
  6. Verify plan details and pricing displays
  7. Review terms if applicable
  8. Click confirm upgrade
  9. Verify payment redirection (Mercado Pago integration)
  10. Verify success message after payment
  11. Verify dashboard shows new plan

**Expected Results:**
  - Upgrade option is accessible
  - Plan details are clearly displayed
  - Payment integration works
  - Upgrade completes successfully
  - Dashboard reflects new plan immediately
  - Features of new plan become available

### 8. Static Pages & Content

**Seed:** `e2e/seed.spec.ts`

#### 8.1. FAQ Page

**File:** `tests/static/faq-page.spec.ts`

**Steps:**
  1. Navigate to FAQ page via navigation or link
  2. Verify page loads with FAQ heading
  3. Verify multiple FAQ items display (questions and answers)
  4. Click on a question to expand answer
  5. Verify answer displays
  6. Click again to collapse
  7. Verify answer hides
  8. Expand multiple questions
  9. Search for FAQ if search feature available

**Expected Results:**
  - FAQ page loads correctly
  - Questions display clearly
  - Expandable answers work
  - Multiple items can be expanded
  - Content is readable and helpful
  - No broken links in FAQ content

#### 8.2. Privacy Policy Page

**File:** `tests/static/privacy-policy.spec.ts`

**Steps:**
  1. Navigate to Privacy Policy page via footer link
  2. Verify page loads with 'Política de Privacidad' heading
  3. Verify policy content displays
  4. Verify policy is in Spanish
  5. Scroll through entire policy
  6. Verify no broken links within policy

**Expected Results:**
  - Privacy policy page loads
  - Content is readable
  - Policy is complete
  - Language is correct
  - No missing sections

#### 8.3. Terms and Conditions Page

**File:** `tests/static/terms-page.spec.ts`

**Steps:**
  1. Navigate to Terms page via footer link or signup reference
  2. Verify page loads with 'Términos y Condiciones' heading
  3. Verify terms content displays completely
  4. Verify terms are in Spanish
  5. Scroll through all sections
  6. Verify no formatting issues

**Expected Results:**
  - Terms page loads correctly
  - Content displays in full
  - Language is correct
  - Formatting is readable
  - No broken sections

#### 8.4. Cookies Policy Page

**File:** `tests/static/cookies-policy.spec.ts`

**Steps:**
  1. Navigate to Cookies Policy via footer link
  2. Verify page loads with cookie policy heading
  3. Verify policy content displays
  4. Verify policy explains cookie usage
  5. Verify policy is in Spanish

**Expected Results:**
  - Cookies policy page loads
  - Content is clear and complete
  - Policy explains cookie types
  - Language is consistent

### 9. Performance & Responsiveness

**Seed:** `e2e/seed.spec.ts`

#### 9.1. Page Load Performance

**File:** `tests/performance/page-load.spec.ts`

**Steps:**
  1. Navigate to home page and measure load time
  2. Verify page loads within 3-5 seconds
  3. Navigate to products page and measure load time
  4. Verify products page loads within 3-5 seconds
  5. Navigate to businesses page and measure load time
  6. Verify businesses page loads within 3-5 seconds
  7. Check for slow network and measure load times again
  8. Verify acceptable performance on slow connections

**Expected Results:**
  - Home page loads quickly
  - Product pages load efficiently
  - Business pages load efficiently
  - Performance is acceptable on slow connections
  - No timeout errors during normal browsing
  - Images load without causing delays

#### 9.2. Mobile Responsiveness - Home Page

**File:** `tests/responsive/mobile-home.spec.ts`

**Steps:**
  1. Open home page on mobile device (375px width)
  2. Verify header displays correctly
  3. Verify navigation menu is accessible (may be hamburger menu)
  4. Verify hero section displays properly on mobile
  5. Verify product cards stack vertically
  6. Verify images are properly scaled
  7. Verify text is readable
  8. Scroll through entire page
  9. Verify footer displays on mobile
  10. Verify all buttons and links are clickable

**Expected Results:**
  - Layout adapts to mobile width
  - Navigation is accessible on mobile
  - Content is readable without zooming
  - Touch targets are adequate size
  - Images are properly scaled
  - No horizontal scrolling needed
  - All functionality works on mobile

#### 9.3. Tablet Responsiveness

**File:** `tests/responsive/tablet-view.spec.ts`

**Steps:**
  1. Open home page on tablet device (768px width)
  2. Verify layout is optimized for tablet
  3. Verify navigation displays appropriately
  4. Verify product cards display 2-3 per row
  5. Verify text sizing is appropriate
  6. Verify images display clearly
  7. Verify all interactive elements work

**Expected Results:**
  - Tablet layout is properly optimized
  - Content utilizes tablet screen space
  - Text is readable at tablet size
  - Images are clear and properly sized
  - Functionality is complete on tablet

#### 9.4. Desktop Responsiveness

**File:** `tests/responsive/desktop-view.spec.ts`

**Steps:**
  1. Open home page on desktop (1920px width or larger)
  2. Verify layout utilizes full width appropriately
  3. Verify product cards display 4-6 per row
  4. Verify header navigation displays fully
  5. Verify all sections are easily scannable
  6. Verify spacing and alignment are correct

**Expected Results:**
  - Desktop layout is well-organized
  - Content is properly distributed across width
  - No excessive whitespace or cramping
  - All elements are properly aligned
  - Hover effects work on desktop

### 10. Data Persistence & Caching

**Seed:** `e2e/seed.spec.ts`

#### 10.1. Session Persistence

**File:** `tests/persistence/session.spec.ts`

**Steps:**
  1. Authenticate as merchant user
  2. Navigate to dashboard
  3. Verify user is authenticated
  4. Refresh page (F5 or Cmd+R)
  5. Verify user is still authenticated
  6. Navigate away from dashboard
  7. Return to dashboard
  8. Verify user is still authenticated
  9. Close browser tab and reopen application in new tab
  10. Verify user is still authenticated if session is persistent

**Expected Results:**
  - Session persists after page refresh
  - Session persists during navigation
  - Session persists across browser tabs if applicable
  - Dashboard remains accessible
  - User information is retained

#### 10.2. Product Data Consistency

**File:** `tests/persistence/product-consistency.spec.ts`

**Steps:**
  1. As authenticated merchant, create a new product with specific details
  2. Navigate away from product creation
  3. Return to dashboard and locate the product
  4. Verify all details are saved correctly
  5. Edit the product with new details
  6. Save changes
  7. Refresh page
  8. Verify edited details persist
  9. Navigate to public view of product
  10. Verify changes are reflected

**Expected Results:**
  - Product data is saved correctly
  - Changes persist after refresh
  - Public view shows latest data
  - No data loss during edit
  - Data consistency across views
