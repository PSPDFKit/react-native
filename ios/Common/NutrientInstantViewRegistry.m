//
//  Copyright © 2018-2026 PSPDFKit GmbH. All rights reserved.
//

#import "NutrientInstantViewRegistry.h"
#import "RCTInstantPSPDFKitView.h"

@interface NutrientInstantViewRegistry ()
@property (nonatomic, strong) NSMutableDictionary<NSString *, RCTInstantPSPDFKitView *> *views;
@property (nonatomic, strong) dispatch_queue_t queue;
@end

@implementation NutrientInstantViewRegistry

+ (instancetype)shared {
    static NutrientInstantViewRegistry *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    if (self = [super init]) {
        _views = [NSMutableDictionary dictionary];
        _queue = dispatch_queue_create("com.pspdfkit.nutrientinstantviewregistry", DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

- (void)registerView:(RCTInstantPSPDFKitView *)view withId:(NSString *)nativeId {
    if (!view || !nativeId) return;
    dispatch_async(self.queue, ^{
        self.views[nativeId] = view;
    });
}

- (nullable RCTInstantPSPDFKitView *)viewForId:(NSString *)nativeId {
    if (!nativeId) return nil;
    __block RCTInstantPSPDFKitView *view = nil;
    dispatch_sync(self.queue, ^{
        view = self.views[nativeId];
    });
    return view;
}

- (void)unregisterViewWithId:(NSString *)nativeId {
    if (!nativeId) return;
    dispatch_async(self.queue, ^{
        [self.views removeObjectForKey:nativeId];
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
