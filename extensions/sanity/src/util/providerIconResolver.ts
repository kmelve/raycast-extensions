export function providerIconResolver(provider: string): string {
  switch (provider) {
    case "google":
      return "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
    case "github":
      return "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg";
    default:
      return "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg";
  }
}
