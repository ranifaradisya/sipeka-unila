export default function SpkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body, body.font-poppins, #__next,
        [data-nextjs-scroll-focus-boundary] {
          background-color: #F0F4F9 !important;
          background: #F0F4F9 !important;
          --background: #F0F4F9 !important;
          --foreground: #0F172A !important;
          --myunila: #1a56db !important;
          --myunila-50: #EEF5FC !important;
          --myunila-100: #CCE5F5 !important;
          --myunila-200: #99CBEB !important;
          --myunila-600: #094B86 !important;
          --myunila-700: #073864 !important;
          --success: #059669 !important;
          --success-bg: #D1FAE5 !important;
          --warning: #D97706 !important;
          --warning-bg: #FEF3C7 !important;
          --danger: #DC2626 !important;
          --danger-bg: #FEE2E2 !important;
          --gray-50: #F8FAFC !important;
          --gray-100: #F1F5F9 !important;
          --gray-200: #E2E8F0 !important;
          --gray-400: #94A3B8 !important;
          --gray-500: #64748B !important;
          --gray-600: #475569 !important;
          --gray-700: #334155 !important;
          --gray-900: #0F172A !important;
          --card-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.06) !important;
        }
        select {
          border: 1.5px solid #E2E8F0 !important;
          border-radius: 7px !important;
          box-shadow: none !important;
        }
        input[type="text"],
        input[type="search"],
        input[type="number"],
        textarea {
          border: revert !important;
          border-width: revert !important;
          box-shadow: revert !important;
        }
      `,
        }}
      />
      {children}
    </>
  );
}