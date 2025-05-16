import { Text } from "@mantine/core";
import React from "react";

function Logo() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 font-bold">
        <div className="border-4 border-purple-800 text-purple-800 text-xl flex items-center justify-center w-10 h-10">
          UB
        </div>
        <Text className=" text-2xl tracking-widest">COMPLIANCE</Text>
      </div>
    </div>
  );
}

export default Logo;
