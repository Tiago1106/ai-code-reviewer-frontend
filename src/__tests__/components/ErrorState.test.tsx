import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorState } from "@/components/states";

// Mock next/link to render a simple anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ErrorState", () => {
  it("renders error message", () => {
    render(<ErrorState message="Algo deu errado." />);

    expect(screen.getByText("Algo deu errado.")).toBeInTheDocument();
  });

  it("renders default title", () => {
    render(<ErrorState message="Erro." />);

    expect(screen.getByText("erro")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    render(<ErrorState title="falha" message="Erro." />);

    expect(screen.getByText("falha")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Erro." onRetry={onRetry} />);

    const button = screen.getByText("$ tentar_novamente");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render retry button when onRetry is omitted", () => {
    render(<ErrorState message="Erro." />);

    expect(screen.queryByText("$ tentar_novamente")).not.toBeInTheDocument();
  });

  it("renders link when linkHref is provided", () => {
    render(<ErrorState message="Erro." linkHref="/review" />);

    const link = screen.getByText("$ novo_review");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/review");
  });

  it("renders custom link label", () => {
    render(
      <ErrorState
        message="Erro."
        linkHref="/review"
        linkLabel="voltar"
      />,
    );

    expect(screen.getByText("$ voltar")).toBeInTheDocument();
  });

  it("does not render link when linkHref is omitted", () => {
    render(<ErrorState message="Erro." />);

    expect(screen.queryByText("$ novo_review")).not.toBeInTheDocument();
  });
});
