package com.inventory;

import android.app.Activity;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.JSBundleLoader;
import com.facebook.react.bridge.JavaScriptExecutor;
import com.facebook.react.module.annotations.ReactModule;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import com.facebook.react.bridge.UiThreadUtil;
import android.app.Application;
import java.lang.reflect.Field;

class Common extends ReactContextBaseJavaModule {
	public String JS_BUNDLE_LOCAL_FILE = "index.android.bundle";
	public String JS_BUNDLE_LOCAL_PATH = getReactApplicationContext().getFilesDir() + File.separator + JS_BUNDLE_LOCAL_FILE;

	Common(ReactApplicationContext reactContext) {
		super(reactContext);
	}
	
	@ReactMethod
	public void reloadBundle() {
        File file = new File(JS_BUNDLE_LOCAL_PATH);
		if(file == null || !file.exists()){
            String msg = "download error, check URL or network state";
            Toast.makeText(getReactApplicationContext(), msg, Toast.LENGTH_SHORT).show();
			return;
        }
		UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
				File file = new File(JS_BUNDLE_LOCAL_PATH);
                try {
                    Activity activity = getCurrentActivity();
                    Application application = activity.getApplication();
                    ReactInstanceManager instanceManager = ((ReactApplication) application).getReactNativeHost().getReactInstanceManager();
                    try {
                        Field jsBundleField = instanceManager.getClass().getDeclaredField("mJSBundleFile");
                        jsBundleField.setAccessible(true);
                        jsBundleField.set(instanceManager, file.getAbsolutePath());
                    } catch (Throwable err) {
                        JSBundleLoader loader = JSBundleLoader.createFileLoader(file.getAbsolutePath());
                        Field loadField = instanceManager.getClass().getDeclaredField("mBundleLoader");
                        loadField.setAccessible(true);
                        loadField.set(instanceManager, loader);
                    }
                    final Method recreateMethod = instanceManager.getClass().getMethod("recreateReactContextInBackground");
                    final ReactInstanceManager finalizedInstanceManager = instanceManager;
                    recreateMethod.invoke(finalizedInstanceManager);
                    activity.recreate();
                } catch (Throwable err) {
                    String msg = "Failed to restart application" + err;
                    Toast.makeText(getReactApplicationContext(), msg, Toast.LENGTH_SHORT).show();
                }
            }
        });
	}
	
	@Override
	public String getName() {
		return "Common";
	}
}