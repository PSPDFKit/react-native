/**
 * Event payload passed to `onShouldExecuteAction` when the native SDK is about
 * to execute a PDF action (for example, when a link annotation is tapped).
 *
 * Use `NutrientView#executeAction(requestId, allow)` to allow or cancel
 * the intercepted action.
 */
export interface ShouldExecuteActionEvent {
  requestId: string;
  pageIndex: number;
  actionType?: string;
  url?: string;
}

