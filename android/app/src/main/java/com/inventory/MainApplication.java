package com.inventory;

import android.app.Application;
import android.widget.Toast;
import android.content.Context;  

import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.remobile.filetransfer.RCTFileTransferPackage;
import com.rnfs.RNFSPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import io.realm.react.RealmReactPackage;

import java.util.Arrays;
import java.util.List;
import java.io.*;

public class MainApplication extends Application implements ReactApplication {
    public String JS_BUNDLE_LOCAL_FILE = "index.android.bundle";
	public String JS_BUNDLE_LOCAL_PATH;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        //public static final String JS_BUNDLE_LOCAL_PATH = "/data/user/0/com.stdnative/files/index.android.bundle";
        

        @Override
        protected String getJSBundleFile() {
            File bundleFile = new File(JS_BUNDLE_LOCAL_PATH);
            if (bundleFile != null && bundleFile.exists()) {
                //Toast.makeText(this.MainApplication, "bundle change success", Toast.LENGTH_SHORT).show();
                return JS_BUNDLE_LOCAL_PATH;
            }
            //Toast.makeText(this.MainApplication, "bundle change faild", Toast.LENGTH_SHORT).show();
            return null;
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new RealmReactPackage(),
                new RCTFileTransferPackage(),
                new RNFSPackage(),
                new ReactNativeRestartPackage(),
                new CommonReactPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        JS_BUNDLE_LOCAL_PATH = getFilesDir() + File.separator + JS_BUNDLE_LOCAL_FILE;
        SoLoader.init(this, /* native exopackage */ false);
    }

    
}
