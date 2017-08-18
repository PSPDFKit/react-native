//
// DocumentsViewControllerBridge.m
//
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>
@import Instant;

@interface RCT_EXTERN_MODULE(DocumentsViewController, UITableViewController)

RCT_EXPORT_METHOD(startInstant) {
  DocumentsViewController *documentsViewController = [[DocumentsViewController alloc] initWithStyle:UITableViewStylePlain];
   UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:(UIViewController *)documentsViewController];

  UIViewController *presentingViewController = RCTPresentedViewController();
  [presentingViewController presentViewController:navigationController animated:YES completion:nil];
}

@end
