//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "NutrientViewRegistry.h"
#import "RCTPSPDFKitView.h"

@interface NutrientViewRegistry ()
@property (nonatomic, strong) NSMutableDictionary<NSString *, RCTPSPDFKitView *> *views;
@property (nonatomic, strong) dispatch_queue_t queue;
@end

@implementation NutrientViewRegistry

+ (instancetype)shared {
    static NutrientViewRegistry *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    if (self = [super init]) {
        _views = [NSMutableDictionary dictionary];
        _queue = dispatch_queue_create("com.pspdfkit.nutrientviewregistry", DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

- (void)registerView:(RCTPSPDFKitView *)view withId:(NSString *)nativeId {
    if (!view || !nativeId) {
        NSLog(@"[NutrientViewRegistry] Warning: Attempted to register view with nil view or nativeId");
        return;
    }
    
    dispatch_async(self.queue, ^{
        self.views[nativeId] = view;
        NSLog(@"[NutrientViewRegistry] Registered view with ID: %@ (Total: %lu)", nativeId, (unsigned long)self.views.count);
    });
}

- (nullable RCTPSPDFKitView *)viewForId:(NSString *)nativeId {
    if (!nativeId) {
        return nil;
    }
    
    __block RCTPSPDFKitView *view = nil;
    dispatch_sync(self.queue, ^{
        view = self.views[nativeId];
    });
    
    if (!view) {
        NSLog(@"[NutrientViewRegistry] Warning: No view found for ID: %@", nativeId);
    }
    
    return view;
}

- (void)unregisterViewWithId:(NSString *)nativeId {
    if (!nativeId) {
        return;
    }
    
    dispatch_async(self.queue, ^{
        RCTPSPDFKitView *removedView = self.views[nativeId];
        if (removedView) {
            [self.views removeObjectForKey:nativeId];
            NSLog(@"[NutrientViewRegistry] Unregistered view with ID: %@ (Total: %lu)", nativeId, (unsigned long)self.views.count);
        }
    });
}

- (NSUInteger)registeredViewCount {
    __block NSUInteger count = 0;
    dispatch_sync(self.queue, ^{
        count = self.views.count;
    });
    return count;
}

@end 