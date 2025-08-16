import requests
import argparse
import re
from urllib.parse import urljoin, urlparse

# --- Helper Functions for Output ---
def print_status(message, color_code='\033[94m'): # Blue
    """Prints a status message with a given color."""
    print(f"{color_code}[*] {message}\033[0m")

def print_success(message):
    """Prints a success message in green."""
    print(f"\033[92m[+] {message}\033[0m")

def print_warning(message):
    """Prints a warning message in yellow."""
    print(f"\033[93m[!] {message}\033[0m")

def print_error(message):
    """Prints an error message in red."""
    print(f"\033[91m[-] {message}\033[0m")

# --- Core Security Check Functions ---

def check_xss(url, payload="<script>alert('XSS')</script>", timeout=5):
    """
    Performs a basic reflected XSS check by injecting a script tag into a common URL parameter.
    This is a simplistic check and serves as a starting point.
    """
    print_status(f"Checking for Reflected XSS on: {url}")
    try:
        # Attempt to inject payload into a common query parameter
        test_url = f"{url}?q={payload}"
        response = requests.get(test_url, timeout=timeout)
        if payload in response.text:
            print_warning(f"  [XSS Vulnerability] Potentially Reflected XSS detected at {test_url}")
            return True
    except requests.exceptions.RequestException as e:
        print_error(f"  Error checking XSS for {url}: {e}")
    return False

def check_sql_injection(url, payloads=["' OR 1=1--", "' OR '1'='1", '"; EXEC xp_cmdshell("dir");--'], timeout=5):
    """
    Performs a basic SQL Injection check using common error-based payloads.
    This demonstrates the concept, but real-world SQLi is more nuanced.
    """
    print_status(f"Checking for Error-Based SQL Injection on: {url}")
    common_sql_errors = [
        "SQL syntax", "mysql_fetch_array", "ORA-", "You have an error in your SQL syntax",
        "MariaDB", "PostgreSQL", "Microsoft SQL Server"
    ]
    try:
        for payload in payloads:
            test_url = f"{url}?id={payload}" # Assuming 'id' is a common parameter for SQLi
            response = requests.get(test_url, timeout=timeout)
            for error in common_sql_errors:
                if error.lower() in response.text.lower():
                    print_warning(f"  [SQLi Vulnerability] Possible SQL Injection detected at {test_url} (Error: '{error}')")
                    return True
    except requests.exceptions.RequestException as e:
        print_error(f"  Error checking SQLi for {url}: {e}")
    return False

def check_security_headers(url, timeout=5):
    """
    Checks for the presence of common security HTTP headers to improve resilience.
    """
    print_status(f"Checking for essential Security Headers on: {url}")
    missing_headers = []
    headers_to_check = {
        'X-Frame-Options': 'Prevents Clickjacking (should be DENY or SAMEORIGIN)',
        'X-Content-Type-Options': 'Prevents MIME-sniffing (should be nosniff)',
        'Strict-Transport-Security': 'HSTS - Enforces HTTPS (should be present for HTTPS sites)',
        'Content-Security-Policy': 'CSP - Mitigates XSS and data injection (can be complex)',
        'Referrer-Policy': 'Controls referrer information (e.g., no-referrer, same-origin)'
    }

    try:
        response = requests.get(url, timeout=timeout)
        response_headers = response.headers
        for header, purpose in headers_to_check.items():
            if header not in response_headers:
                missing_headers.append(f"{header} (Purpose: {purpose})")

        if missing_headers:
            print_warning(f"  [Missing Headers] Found missing security headers for {url}:")
            for h in missing_headers:
                print_warning(f"    - {h}")
            return True
        else:
            print_success(f"  [Security Headers] All checked security headers are present for {url}.")
            return False # No issues found
    except requests.exceptions.RequestException as e:
        print_error(f"  Error checking security headers for {url}: {e}")
    return False # Return False on error, assuming no issues found then

# --- Main Scanner Logic ---

def scan_website(target_url):
    """
    Orchestrates the basic vulnerability scan for the given target URL.
    """
    print(f"\n{'='*60}")
    print_status(f" Initiating PyScout Basic Scan for: {target_url}")
    print(f"{'='*60}\n")

    # Ensure URL is properly formatted for requests
    if not target_url.startswith('http://') and not target_url.startswith('https://'):
        target_url = 'http://' + target_url # Default to HTTP if no scheme specified

    vulnerabilities_found = []

    # Run checks
    if check_xss(target_url):
        vulnerabilities_found.append("Reflected XSS")
    if check_sql_injection(target_url):
        vulnerabilities_found.append("Error-Based SQL Injection")
    if check_security_headers(target_url):
        vulnerabilities_found.append("Missing/Incomplete Security Headers")

    print(f"\n{'='*60}")
    print_status("Scan Summary:")
    if vulnerabilities_found:
        print_warning(f"  PyScout detected {len(vulnerabilities_found)} potential vulnerabilities:")
        for vul in vulnerabilities_found:
            print_warning(f"    - {vul}")
    else:
        print_success("  No common vulnerabilities detected by PyScout (basic scan).")
    print(f"{'='*60}\n")

# --- Command-Line Interface Setup ---

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="PyScout: A basic Python-based web vulnerability scanner.",
        epilog="""
        Examples:
          python pyscout.py -u http://testphp.vulnweb.com/
          python pyscout.py --url https://your-test-site.com
        """
    )
    parser.add_argument(
        "-u", "--url",
        required=True,
        help="The target URL to scan (e.g., https://example.com/)"
    )

    args = parser.parse_args()
    scan_website(args.url)