import AccountShell from "@/components/AccountShell";
import AccountProfileForm from "@/components/AccountProfileForm";

export default function CuentaEmpresaPage() {
  return (
    <AccountShell>
      <AccountProfileForm variant="company" />
    </AccountShell>
  );
}
