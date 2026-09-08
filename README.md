# Personal Reading List

A simple reading list backed by the Open Library API. Books can be searched, added, and removed. Saved books persist with `localStorage`.

## Acceptance criteria

### Empty state
Open the page with an empty browser storage. The **Your list is empty** state explains what the feature is for and provides **Find your first book**.

### Loading state
Search for a book such as **The Hobbit**. The **Loading books…** state appears while the API request is running.

### Error state
Open browser DevTools, go to **Network**, select **Offline**, then search for a book. The **We couldn’t load the books** state explains that the search failed and tells the reviewer to check the connection and try again. Turn the network back on and use **Try again**.

The three states are visually and textually distinct, and all can be demonstrated without changing application code.

## Accessibility

The page uses semantic headings, sections, forms, buttons, and articles. Search and actions are keyboard operable, and all interactive elements have visible focus styles. Loading/error status changes are announced with `aria-live`, and the error uses an alert role. Book covers have meaningful alternative text.

## Running

Open `index.html` in a browser. Internet access is required for Open Library searches; the saved reading list is stored locally in the browser.
