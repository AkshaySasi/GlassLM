// Content script to detect inputs and inject GlassLM icon
import './content.css';

// Create floating icon
const createIcon = () => {
    // Check if icon already exists to avoid duplicates
    let existing = document.getElementById('glasslm-floating-icon');
    if (existing) return existing;

    const host = document.createElement('div');
    host.id = 'glasslm-floating-icon';
    // Position the HOST element fixed (so it moves with viewport)
    // We attach styles to the host directly or via style tag in shadow?
    // Shadow host styles need to be defined on the element itself or via :host
    host.style.position = 'fixed';
    host.style.zIndex = '2147483647';
    // Removed inline opacity/pointer-events to let CSS class handle visibility
    host.style.transition = 'opacity 0.2s ease';

    // Create Shadow DOM
    const shadow = host.attachShadow({ mode: 'open' });

    // Use the branding logo image
    const logoUrl = chrome.runtime.getURL('glass_logo.jpg');

    shadow.innerHTML = `
        <style>
            :host {
                display: block;
                width: 32px;
                height: 32px;
            }
            .glasslm-crystal {
                width: 32px;
                height: 32px;
                /* Removed background/border as requested */
                background: transparent;
                border-radius: 8px; /* Keep radius for image clipping */
                display: flex;
                align-items: center;
                justify-content: center;
                /* Removed box-shadow and backdrop-filter */
                cursor: pointer;
                pointer-events: auto;
                animation: glasslm-float 3s ease-in-out infinite;
                transform: scale(0.9);
                transition: transform 0.2s ease;
            }
            .glasslm-crystal:hover {
                transform: scale(1.1);
                /* Add a subtle glow on hover only, or remove entirely if desired. keeping subtle for feedback */
                filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6));
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border: none;
                display: block;
                margin: 0;
                padding: 0;
                /* Ensure image shape */
                border-radius: 6px; 
            }
            @keyframes glasslm-float {
                0% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-3px) scale(1.05); }
                100% { transform: translateY(0px) scale(1); }
            }
        </style>
        <div class="glasslm-crystal">
            <img src="${logoUrl}" alt="GlassLM" />
        </div>
    `;

    document.documentElement.appendChild(host);

    // Attach listener to the shadow root (captures events from children)
    const crystal = shadow.querySelector('.glasslm-crystal');
    if (crystal) {
        crystal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Send message
            const textToMask = activeInput
                ? ((activeInput as HTMLInputElement).value || activeInput.innerText || activeInput.textContent || '')
                : window.getSelection()?.toString() || '';

            chrome.runtime.sendMessage({ action: 'openSidePanel', text: textToMask });
        });
    }

    return host;
};

let icon = createIcon();
let activeInput: HTMLElement | null = null;
let updateInterval: number | null = null;

// Ensure icon stays in DOM (SPAs might wipe body)
const guardianObserver = new MutationObserver(() => {
    if (!document.getElementById('glasslm-floating-icon')) {
        icon = createIcon();
    }
});
guardianObserver.observe(document.documentElement, { childList: true, subtree: false });

// Improved element classification
function getEditableElement(element: HTMLElement | null): HTMLElement | null {
    let current = element;
    let depth = 0;

    // Check up to 5 levels up
    while (current && current !== document.body && depth < 5) {
        // detection logic
        const isEditable = current.isContentEditable ||
            current.getAttribute('contenteditable') === 'true' ||
            current.getAttribute('role') === 'textbox'; // Gemini/AI chats often use role="textbox"

        const isInput = current.tagName === 'INPUT' &&
            ['text', 'search', 'email', 'url', 'tel', 'password'].includes((current as HTMLInputElement).type);

        const isTextarea = current.tagName === 'TEXTAREA';

        if (isEditable || isInput || isTextarea) {
            return current;
        }

        current = current.parentElement;
        depth++;
    }
    return null;
}

// Global checking function
const checkFocus = (target: HTMLElement | null) => {
    if (!target) return;

    const editable = getEditableElement(target);

    if (editable) {
        activeInput = editable;
        positionIcon(editable);

        // Make host interactive and visible using CSS class behavior mimicking
        // Since we removed the class approach for direct style manipulation:
        const host = document.getElementById('glasslm-floating-icon');
        if (host) {
            host.style.opacity = '1';
            host.style.pointerEvents = 'auto';
        }

        // Start continuous tracking while focused
        if (updateInterval) clearInterval(updateInterval);
        updateInterval = window.setInterval(() => {
            if (activeInput && activeInput.isConnected) {
                positionIcon(activeInput);
            } else {
                if (host) {
                    host.style.opacity = '0';
                    host.style.pointerEvents = 'none';
                }
                if (updateInterval) clearInterval(updateInterval);
            }
        }, 100);
    }
};

// Listen to multiple event types to catch everything
document.addEventListener('focusin', (e) => checkFocus(e.target as HTMLElement), true);
document.addEventListener('click', (e) => checkFocus(e.target as HTMLElement), true);
document.addEventListener('keyup', (e) => checkFocus(e.target as HTMLElement), true);

// Hide logic
document.addEventListener('focusout', (e) => {
    setTimeout(() => {
        // If we moved focus to body (common in some apps) or clicking UI, don't hide immediately if we are still interacting
        // But generally, if we leave the input, hide it.
        const newFocus = document.activeElement;
        const host = document.getElementById('glasslm-floating-icon');

        // Check if we clicked inside the shadow DOM? Accessing shadowRoot activeElement is tricky from here on `document`
        // But the click handler on the crystal prevents default, so focus might not shift?

        // If new focus is not the input and not inside the input
        if (newFocus !== activeInput && (!activeInput || !activeInput.contains(newFocus))) {
            if (host) {
                host.style.opacity = '0';
                host.style.pointerEvents = 'none';
            }
            activeInput = null;
            if (updateInterval) clearInterval(updateInterval);
        }
    }, 200);
});

function positionIcon(element: HTMLElement) {
    if (!element.offsetParent && element !== document.body) return;

    const rect = element.getBoundingClientRect();

    let top = rect.top + 10;

    // Safety check for very small inputs
    if (rect.height < 40) {
        top = rect.top + (rect.height / 2) - 16;
    }
    if (top < 0) top = rect.top; // Keep on screen

    // Calculate left position (inside the input on the right)
    let left = rect.right - 45;

    // Catch edge case: if input is full width, ensure icon isn't off screen
    if (left > window.innerWidth - 45) {
        left = window.innerWidth - 45;
    }

    icon.style.top = `${top}px`;
    icon.style.left = `${left}px`;
}

// Observe DOM mutations to catch dynamic inputs or resizing
const observer = new MutationObserver((mutations) => {
    if (activeInput) {
        positionIcon(activeInput);
    }
});
observer.observe(document.body, { childList: true, subtree: true, attributes: true });

// Listen for requests from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getText') {
        let text = '';
        if (activeInput) {
            text = (activeInput as HTMLInputElement).value || activeInput.innerText || activeInput.textContent || '';
        } else if (document.activeElement) {
            // Fallback to check active element if we missed tracking it
            const editable = getEditableElement(document.activeElement as HTMLElement);
            if (editable) {
                text = (editable as HTMLInputElement).value || editable.innerText || editable.textContent || '';
            } else {
                // Try selection
                text = window.getSelection()?.toString() || '';
            }
        }
        sendResponse({ text });
    }
    return true;
});

console.log('GlassLM Content Script Loaded');
