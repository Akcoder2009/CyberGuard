from urllib.parse import urlparse


def analyze_url(url: str):
    parsed = urlparse(url)

    hostname = parsed.hostname or ""
    subdomains = hostname.split(".")

    suspicious_keywords = [
        "login",
        "verify",
        "password",
        "account",
        "secure",
        "update",
        "payment",
        "signin",
    ]

    found_keywords = [
        word for word in suspicious_keywords
        if word in url.lower()
    ]

    return {
        "scheme": parsed.scheme,
        "domain": hostname,
        "path": parsed.path,
        "query": parsed.query,
        "url_length": len(url),
        "subdomain_count": max(len(subdomains) - 2, 0),
        "suspicious_keywords": found_keywords,
    }
    