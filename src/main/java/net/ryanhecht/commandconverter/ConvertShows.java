package net.ryanhecht.commandconverter;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.script.ScriptException;

import org.apache.commons.io.FilenameUtils;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.configuration.file.YamlConfiguration;

import net.md_5.bungee.api.ChatColor;

public class ConvertShows implements CommandExecutor {

  @Override
  public boolean onCommand(CommandSender sender, Command cmd, String lbl,
      String[] args) {
    File showFolder = new File(Main.getInstance().getDataFolder().getParent(), "ShowsRebuild");
    try {
      convertFiles(showFolder, sender);
    } catch (IOException | ScriptException e) {
      sender.sendMessage(ChatColor.RED + "Encountered error converting files.");
      e.printStackTrace();
    }
    return false;
  }

  public static void convertFiles(File directory, CommandSender sender) throws IOException, ScriptException {
    try (Stream<Path> paths = Files.walk(directory.toPath())) {
      // Streams don't seem to like me very much :(
      for(Path path : paths.collect(Collectors.toList())) {
        File file = path.toFile();
        if (FilenameUtils.getExtension(file.getName()).equalsIgnoreCase("toaster")) {
          YamlConfiguration config = YamlConfiguration.loadConfiguration(file);
          for (String key : config.getKeys(false)) {
            if(key.contains("cmd")) {
              String cmd = config.getString(key + ".cmd");
              String newCmd = Main.getScriptManager().convertCommand(cmd);
              if (newCmd.charAt(0) == '/') {
                newCmd = newCmd.substring(1);
              }
              config.set(key + ".cmd", newCmd);
            }
          }
          config.save(file);
          if (sender != null) {
            sender.sendMessage("Converted " + file.getAbsolutePath());
          }
        }
      }
    }
  }
}
