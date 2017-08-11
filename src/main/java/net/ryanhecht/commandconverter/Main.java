package net.ryanhecht.commandconverter;

import java.io.IOException;
import javax.script.ScriptException;
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;

public class Main extends JavaPlugin {
  private static Main instance;
  private static ScriptManager scriptManager;
  private static ChunkLoadListener listener;

  @Override
  public void onEnable() {
    instance = this;

    if(!getDataFolder().exists()) {
      getDataFolder().mkdirs();
    }

    try {
      listener = new ChunkLoadListener();
    } catch (IOException e) {
      e.printStackTrace();
      Bukkit.getLogger().severe("IO error! Could not load visited chunks. If this persists, delete visited.txt");
      Bukkit.getPluginManager().disablePlugin(this);
    }

    try {
      scriptManager = new ScriptManager();
    } catch (ScriptException | IOException e) {
      e.printStackTrace();
      Bukkit.getLogger().severe("Could not setup scripting manager. Disabling.");
      Bukkit.getPluginManager().disablePlugin(this);
    }



  }

  @Override
  public void onDisable() {
    try {
      listener.saveCache();
    } catch (IOException e) {
      Bukkit.getLogger().severe("IO error! Could not save visited chunks.");
      e.printStackTrace();
    }
  }


  public static Main getInstance() {
    return instance;
  }

  public static ScriptManager getScriptManager() {
    return scriptManager;
  }
}
