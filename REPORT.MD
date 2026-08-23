# Code Authorship Analysis Report

## 1. Overall Authorship Summary

**Verdict: Mixed effort, with a slight majority of AI/tool-assisted code.**

The repository does not look like a single uniformly authored codebase. It combines recognizable generated or copied component-library code with application-specific task-management code that appears to have been iteratively designed and edited by a human, likely with AI assistance. The strongest conclusion is therefore **Mixed**, not purely Human-written or purely AI-generated.

This assessment is based on source-code style and repository structure, not on definitive provenance. Authorship cannot be proven from code appearance alone; copied templates, formatters, generated UI libraries, and experienced developers can produce similar signals.

## 2. Estimated Percentages

**Estimated authorship by source-code volume and style:**

- **AI-generated or AI/tool-assisted: 60%**
- **Human-written or substantially human-directed: 40%**

These percentages include generated/template UI code as AI/tool-assisted because much of that layer follows generator conventions (notably shadcn-style primitives and a Magic UI-style animated theme toggler). They do not mean that every line was produced by a language model.

## 3. Detailed Justification (The “Why”)

### Variable and function naming

The application code uses clear, descriptive names such as `getTodosByUser`, `updateTodoStatus`, `initialTranslations`, `localeErrorFlags`, `handleSelectEvent`, and `handleNavigate` (`src/actions/todo.ts`, `src/components/shared/todo-form.tsx`, and `src/components/shared/todo-calendar.tsx`). This is consistent with modern TypeScript conventions and could be human or AI-authored.

Several names and patterns are unusually explicit and regular, which is a common AI-assisted characteristic:

- `getAuthContext` followed by `requireAuth` creates a textbook authentication-helper pair.
- Repeated names such as `isLoading`, `isPending`, `handleOpen`, `handleDelete`, and `onSubmit` are consistently applied across components.
- `TodoFormInterface`, `TodoFormInput`, `TodoLocalization`, and `TodoWhereInput` are precise but somewhat schema-shaped names, suggesting generated or heavily AI-assisted typing.

There are also human-directed choices that are more domain-specific than generic boilerplate, including localization-specific concepts (`localizations`, required English locale, `fr_FR`), month-range navigation, and the decision to publish content after mutations. These indicate that the author understood and shaped the product requirements.

### Comment styles

Comments are sparse overall. The custom feature code contains concise, contextual comments rather than textbook explanations:

- `src/components/shared/todo-calendar.tsx:98` explains why a full month range is fetched during navigation.
- `src/components/shared/todo-list.tsx:20` explains synchronization of server-provided initial data.
- `src/proxy.ts:9-14` labels the two authentication redirect cases.

This is more human-contextual than the over-commented style often seen in raw AI output. At the same time, comments are placed exactly at likely complexity points and use polished explanatory wording, which is consistent with AI-generated comments later reviewed by a human.

The UI primitive layer is almost comment-free except for compatibility annotations such as `@ts-expect-error` in `src/components/ui/calendar.tsx:103` and a structural explanation in `src/components/ui/sidebar.tsx:210`. That pattern strongly resembles a library generator or copied component source rather than bespoke handwritten UI.

### Code structure and predictability

The strongest AI/tool-generated signal is the structure of `src/components/ui`. The files use repeated `data-slot` attributes, `cva` variant definitions, `React.forwardRef`/render wrappers, and highly consistent Tailwind class composition. This is characteristic of generated shadcn/Base UI components. `src/components/ui/sidebar.tsx` is especially large and systematic, with many related subcomponents and variants, while `alert-dialog.tsx`, `dialog.tsx`, `select.tsx`, `tabs.tsx`, `toast.tsx`, and `tooltip.tsx` follow the same factory-like pattern.

`src/components/ui/animated-theme-toggler.tsx` is another strong generated/template signal. It contains a generalized transition system with seven shape variants, polygon construction helpers, CSS view-transition integration, controlled/uncontrolled state support, animation cancellation, and cleanup. The abstraction is much broader than the needs of this application, which suggests imported or AI-produced reusable UI rather than organically evolved product code.

The custom layer is more mixed:

- `src/components/shared/todo-card.tsx` combines optimistic UI, transitions, modal editing, deletion confirmation, and toasts in a pragmatic feature-oriented way.
- `src/components/shared/todo-calendar.tsx` has application-aware behavior for overdue tasks, localized calendar cultures, event selection, month navigation, and task editing.
- `src/actions/todo.ts` reflects real product workflow: ownership checks, locale selection from cookies, pagination, publishing/unpublishing, cache revalidation, and mutation sequencing.

Those features are specific enough to indicate human requirements and review, but the implementation is highly regular and defensive in a way that commonly results from AI-assisted development.

The repository history also shows incremental, feature-specific commits such as “added calendar view”, “added update todo”, and fixes for locale publishing and pagination. That history supports a human-directed iterative process rather than a one-shot generated repository.

### Error handling

Error handling is consistent and user-facing:

- Server actions log contextual objects such as `{ id, err }` and throw domain-oriented messages (`src/actions/todo.ts:86-88`, `216-219`).
- Client components restore optimistic state and display success/error toasts (`src/components/shared/todo-card.tsx:78-106`).
- Pagination exposes a retry path instead of silently failing (`src/components/shared/todo-list.tsx:44-48`, `61-69`).
- Form submission distinguishes create and update outcomes (`src/components/shared/todo-form.tsx:86-102`).

This is better than generic catch-and-ignore behavior and suggests deliberate product handling. However, the repeated structure—`try`, `console.error` with a standardized message, toast, and generic user-safe fallback—is highly uniform and likely AI-assisted. Some catches also collapse potentially different server failures into the same generic message, which is a common generated compromise.

## 4. File-by-File Analysis (or Component Breakdown)

### Strongly generated or tool-derived

| Area | Files | Evidence |
|---|---|---|
| UI primitives | `src/components/ui/alert-dialog.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `checkbox.tsx`, `dialog.tsx`, `form.tsx`, `input.tsx`, `label.tsx`, `popover.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `skeleton.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `tooltip.tsx` | Repeated `data-slot` conventions, `cva` variants, primitive wrappers, and uniform Tailwind composition. |
| Complex generated UI | `src/components/ui/sidebar.tsx` | Large generalized component family with context, responsive behavior, keyboard shortcuts, cookies, mobile sheets, skeletons, and variants. |
| Calendar primitive | `src/components/ui/calendar.tsx` | Broad react-day-picker adapter with many generated class maps and a compatibility `@ts-expect-error`. |
| Theme animation | `src/components/ui/animated-theme-toggler.tsx` | General-purpose seven-shape clip-path animation, view-transition support, controlled mode, cleanup, and animation cancellation exceed the local feature requirement. |
| Project scaffolding | `README.md`, `next.config.ts`, `postcss.config.mjs`, `components.json` | Standard create-next-app/shadcn-style scaffolding with little repository-specific documentation. |

### Likely AI-assisted but human-directed

| Area | Files | Evidence |
|---|---|---|
| Domain server actions | `src/actions/todo.ts` | Strong application-specific workflow, but highly symmetrical helper/mutation patterns, repeated authorization checks, and standardized error logging. |
| Task form | `src/components/shared/todo-form.tsx` | Thoughtful localization validation and tab error indicators, combined with very regular hook/memo/callback organization and polished generated copy. |
| Task card | `src/components/shared/todo-card.tsx` | Optimistic completion, edit loading, deletion confirmation, and toasts show product intent; repeated transition/catch patterns suggest AI assistance. |
| Calendar feature | `src/components/shared/todo-calendar.tsx` | Domain-aware overdue/completed styling and query-range navigation are human-specific; event and callback organization is highly systematic. |
| List pagination | `src/components/shared/todo-list.tsx` | IntersectionObserver pagination, state synchronization, retry UI, and explicit loading states are coherent but resemble an AI-generated implementation pattern. |
| Authentication middleware | `src/proxy.ts` | Simple and clear redirect logic with concise contextual comments; likely adapted from a standard Clerk/Next.js pattern. |

### More distinctly human or manually adapted

| Area | Files | Evidence |
|---|---|---|
| Product composition | `src/app/(auth)/page.tsx`, `src/app/(auth)/calendar/page.tsx`, `src/components/shared/header.tsx`, `src/components/shared/app-sidebar.tsx` | Product-specific labels, layout decisions, navigation, empty states, and calendar copy. |
| GraphQL domain definitions | `src/graphql/mutations/todo.ts`, `src/graphql/queries/todo.ts` | Schema choices for publication, localization, ownership, and date filtering are specific to the backend model. |
| Login integration | `src/components/shared/login-form.tsx`, `src/app/sso-callback/page.tsx` | Provider-specific GitHub/Google OAuth behavior and Clerk redirect destinations. |
| Small utility/adaptor files | `src/lib/utils.ts`, `src/lib/type.ts`, `src/providers/ApolloProvider.tsx`, `src/components/shared/svg.tsx` | Small, direct implementations and manually selected product types/assets, although some SVG content appears copied from icon examples. |

### Style inconsistencies indicating multiple sources

The repository contains both semicolon-heavy double-quoted files and semicolon-free single-quoted files. For example, `src/actions/todo.ts` and most shared components use one style, while `src/components/ui/calendar.tsx`, `src/components/ui/datepicker.tsx`, `src/components/ui/sidebar.tsx`, and `src/hooks/use-mobile.ts` use another. There are also inconsistent indentation and formatting in `src/app/(auth)/layout.tsx`, `src/app/(auth)/error.tsx`, `src/app/(auth)/loading.tsx`, and `src/components/shared/svg.tsx`.

This is strong evidence of multiple origins—generated components, copied examples, and application code—rather than one author maintaining a single style throughout.

## 5. Conclusion & Recommendations

The codebase is maintainable at the feature level, but it should be treated as a **mixed-origin, AI-assisted TypeScript application**. The domain model and user flows are understandable, and the custom code has clear boundaries between server actions, GraphQL operations, shared components, and UI primitives. The generated UI layer is consistent and reusable, but its size and abstraction level can obscure which code is truly product-specific.

Recommended maintenance practices:

1. Keep generated UI primitives isolated and avoid manually diverging from their upstream conventions without documenting the reason.
2. Add focused tests for authorization ownership checks, locale validation, publication sequencing, date-range pagination, optimistic status rollback, and delete failure behavior.
3. Standardize formatting and linting across generated and custom code so future edits reveal real changes more clearly.
4. Replace broad user-facing error fallbacks with typed/domain-specific errors where operational diagnosis matters.
5. Add repository-specific documentation; the current README remains largely the default Next.js starter text.

**Confidence:** Moderate. The mixed-origin conclusion is high confidence because of the clearly recognizable generated UI patterns and the distinct application-specific layer. The numerical split is approximate and should not be interpreted as forensic proof of who wrote individual lines.
