import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

// Mock next/link — consistent with project test conventions
jest.mock("next/link", () => {
  return function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("NotFound (404 page)", () => {
  it("renders a 404 heading and descriptive copy", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(/doesn't exist or may have been moved/i)
    ).toBeInTheDocument();
  });

  it("provides a recovery link back to home", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /return to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
