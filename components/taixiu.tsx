"use client";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  cn,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { toast } from "sonner";
import dice from "@/public/dice.json";
import { useClerk, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useHistory } from "@/hooks/use-cau";
import { Doc } from "@/convex/_generated/dataModel";

const TaiXiu = ({ user }: { user: any }) => {
  const { signOut } = useClerk();
  const { history, setHistory } = useHistory();

  const update = useMutation(api.user.update);
  const u = useQuery(api.user.getUserByUser, { userId: user.id });

  const tiencuoc = [
    {
      value: 1000,
      label: "1K",
    },
    {
      value: 10000,
      label: "10K",
    },
    {
      value: 50000,
      label: "50K",
    },
    {
      value: 100000,
      label: "100K",
    },
    {
      value: 500000,
      label: "500K",
    },
    {
      value: 1000000,
      label: "1M",
    },
    {
      value: 5000000,
      label: "5M",
    },
    {
      value: 10000000,
      label: "10M",
    },
    {
      value: 50000000,
      label: "50M",
    },
  ];
  const [isRandom, setIsRandom] = useState(false);
  const [bet, setBet] = useState<{ bet0: number; bet1: number; mode: 0 | 1 }>({
    bet0: 0,
    bet1: 0,
    mode: 0,
  });
  const [isBet, setIsBet] = useState(false);
  const [tien, setTien] = useState(0);

  const tinhtien = () => {
    const so = play();
    if (u?.coin) {
      if (isBet) {
        if (so > 4 && so < 10) {
          setHistory([...history, "Tài"]);
          update({ id: u?._id, coin: u?.coin + bet.bet0 - bet.bet1 });
        } else if (so > 10 && so < 17) {
          setHistory([...history, "Xỉu"]);
          update({ id: u?._id, coin: u?.coin - bet.bet0 + bet.bet1 });
        }

        setBet({ bet0: 0, bet1: 0, mode: 0 });
        setIsBet(false);
      }
      if (so > 4 && so < 10) {
        setHistory([...history, "Tài"]);
      } else if (so > 10 && so < 17) {
        setHistory([...history, "Xỉu"]);
      }
    }
  };
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <XocDia setIsRandom={setIsRandom} tinhtien={tinhtien} />;
    } else {
      return (
        <div className=" w-full p-8 bg-[#200901] text-[#E4BE4B] rounded-full flex items-center justify-center text-5xl">
          <span>{seconds}</span>
        </div>
      );
    }
  };
  const handleNap = () => {
    if (u?.coin) {
      update({ id: u?._id, coin: u?.coin + 100000000 });
    }
  };
  useEffect(() => {
    if (user?.fullName) {
      if (u?.username === "") {
        update({ id: u._id, username: user.fullName });
      }
    }
  }, []);
  if (!u?.coin) {
    return null;
  }
  return (
    <div className=" w-full h-full overflow-hidden  bg-gradient-to-br from-[#8C6339] via-[#C9AF86] to-[#47240D]">
      <div className=" absolute top-0 left-0 w-[100dvw] z-10 flex items-center p-3">
        <Chip className="from-[#8C6339] via-[#C9AF86] to-[#FFEBBC] bg-gradient-to-br ml-auto flex gap-3 py-10 text-3xl px-10 ">
          <span> {user.fullName}</span>
          <span className="ml-2 font-semibold">
            {formatNumberWithCommas(u?.coin!)}
          </span>
        </Chip>
        <Button
          onPress={handleNap}
          className="text-[#FFAEC0] text-xl bg-gradient-to-tl from-[#51041D] via-[#50041D] to-[#FFAEC0] ml-auto"
        >
          Nạp tiền
        </Button>
        <Button
          onPress={() => signOut()}
          className="text-[#FFAEC0] text-xl bg-gradient-to-tl from-[#51041D] via-[#50041D] to-[#FFAEC0] ml-auto"
        >
          Đăng xuất
        </Button>
      </div>

      <div className=" w-[100vw] h-[100vh] px-40 relative flex sm:flex-row flex-col items-center justify-center">
        <div className=" flex items-center gap-5">
          <div className="flex flex-col items-center justify-center">
            <Card>
              <CardBody className=" bg-gradient-to-br from-[#8C6339] via-[#C9AF86] to-[#FFEBBC]">
                <div className="flex flex-col gap-3">
                  <span className=" font-bold text-3xl flex items-center justify-center">
                    {"TÀI XỈU REAL UY TÍN SỐ 1"}
                  </span>
                  <div className=" flex items-center gap-5 justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Chip
                        className={cn(
                          " text-5xl h-[100px] px-16 shadow-inner bg-gradient-to-tl from-[#8C6339] via-[#C9AF86] to-[#FFEBBC] duration-300"
                        )}
                      >
                        Tài
                      </Chip>
                      <Chip className="bg-[#62011A] text-[#EACD6C] text-xl">
                        {formatNumberWithCommas(bet.bet0)}
                      </Chip>
                      <Button
                        onPress={() =>
                          setBet({ bet0: bet.bet0, bet1: bet.bet1, mode: 0 })
                        }
                        className="bg-[#200901] text-[#E4BE4B]"
                      >
                        Đặt cược
                      </Button>
                    </div>
                    {isRandom ? (
                      <div className=" w-full p-5 bg-[#200901] text-[#E4BE4B] rounded-full flex items-center justify-center">
                        <Lottie animationData={dice} width={300} />
                      </div>
                    ) : (
                      <Countdown
                        date={Date.now() + 10000}
                        renderer={renderer}
                      />
                    )}

                    <div className="flex flex-col items-center gap-2">
                      <Chip
                        className={cn(
                          " text-5xl h-[100px] px-16 shadow-inner bg-gradient-to-tl from-[#8C6339] via-[#C9AF86] to-[#FFEBBC] duration-500"
                        )}
                      >
                        Xỉu
                      </Chip>
                      <Chip className="bg-[#62011A] text-[#EACD6C] text-xl">
                        {formatNumberWithCommas(bet.bet1)}
                      </Chip>

                      <Button
                        onPress={() =>
                          setBet({ bet0: bet.bet0, bet1: bet.bet1, mode: 1 })
                        }
                        className="bg-[#200901] text-[#E4BE4B]"
                      >
                        Đặt cược
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {tiencuoc.map((item, index) => (
                      <Button
                        onPress={() => {
                          if (bet.mode === 1) {
                            setBet({
                              bet0: bet.bet0,
                              bet1: bet.bet1 + item.value,
                              mode: bet.mode,
                            });
                          } else {
                            setBet({
                              bet0: bet.bet0 + item.value,
                              bet1: bet.bet1,
                              mode: bet.mode,
                            });
                          }
                        }}
                        className="bg-[#62011A] text-[#EACD6C] text-xl border-3 border-[#EACD6C]"
                        key={index}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {history.slice(-12).map((item, index) => (
                      <Chip
                        className="bg-[#62011A] text-[#EACD6C] text-xl border-3 border-[#EACD6C]"
                        key={index}
                      >
                        {item}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className=" flex items-center justify-center gap-3 mt-5">
              <Button
                onPress={() => {
                  if (bet.mode === 1) {
                    setBet({
                      bet0: bet.bet0,
                      bet1: bet.bet1 + u.coin!,
                      mode: bet.mode,
                    });
                  } else {
                    setBet({
                      bet0: bet.bet0 + u.coin!,
                      bet1: bet.bet1,
                      mode: bet.mode,
                    });
                  }
                }}
                variant="shadow"
                className=" rounded-full text-[#F9DFAD] text-xl px-8 py-5 font-semibold bg-gradient-to-tl from-[#2F0838] via-[#D67ED6] to-[#4F2C0F]"
              >
                ALL-IN
              </Button>
              <Button
                onPress={() => {
                  if (u.coin! < bet.bet0 + bet.bet1) {
                    toast.error("Không đủ tiền cược.");
                  } else {
                    setIsBet(true);
                  }
                }}
                variant="shadow"
                className=" rounded-full text-[#E3DDCF] text-3xl px-10 py-7 font-semibold bg-gradient-to-tl from-[#532B06] via-[#D9C494] to-[#73480C]"
              >
                {isBet ? "Đã đặt cược" : "Đặt cược"}
              </Button>

              <Button
                onPress={() => {
                  setIsBet(false);
                  setBet({ bet0: 0, bet1: 0, mode: 0 });
                }}
                variant="shadow"
                className=" rounded-full text-[#FFAEC0] text-xl px-8 py-5 font-semibold bg-gradient-to-tl from-[#51041D] via-[#50041D] to-[#FFAEC0]"
              >
                Hủy
              </Button>
            </div>
          </div>
          <AutoPlay u={u} />
        </div>
      </div>
    </div>
  );
};

const XocDia = ({
  setIsRandom,
  tinhtien,
}: {
  setIsRandom: (v: boolean) => void;
  tinhtien: () => void;
}) => {
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <XocDia tinhtien={tinhtien} setIsRandom={setIsRandom} />;
    } else {
      return (
        <div className=" w-full p-8 bg-[#200901] text-[#E4BE4B] rounded-full flex items-center justify-center text-5xl">
          <span>{seconds}</span>
        </div>
      );
    }
  };

  useEffect(() => {
    setIsRandom(true);
    (async () => {
      setTimeout(() => {
        setIsRandom(false);
        tinhtien();
      }, 4000);
    })();
  }, []);

  return <Countdown date={Date.now() + 30000} renderer={renderer} />;
};
const AutoPlay = ({ u }: { u: Doc<"user"> }) => {
  const update = useMutation(api.user.update);
  const [sotran, setSoTran] = useState<number>(100);
  const [percent, setPercent] = useState<number>(25);
  const [coin, setCoin] = useState<number>(25000);
  const [mode, setMode] = useState<number>(2);
  const modes = [
    {
      key: 1,
      value: "Đánh theo tiền",
    },
    {
      key: 2,
      value: "Đánh theo %",
    },
  ];
  const handleAuto = () => {
    if (u.coin) {
      let tien: number = u.coin;
      if (mode === 1) {
        for (let i = 0; i < sotran; i++) {
          const so = play();
          const so1 = play();

          if (
            (so > 4 && so < 10 && so1 > 4 && so1 < 10) ||
            (so > 10 && so < 17 && so1 > 10 && so1 < 17)
          ) {
            tien += coin;
          } else {
            tien -= coin;
          }
        }
      } else if (mode === 2) {
        for (let i = 0; i < sotran; i++) {
          const so = play();
          const so1 = play();

          if (
            (so > 4 && so < 10 && so1 > 4 && so1 < 10) ||
            (so > 10 && so < 17 && so1 > 10 && so1 < 17)
          ) {
            tien += (tien * percent) / 100;
          } else {
            tien -= (tien * percent) / 100;
          }
        }
      }

      update({ id: u?._id, coin: tien });
    }
  };
  return (
    <Card>
      <CardBody className=" bg-gradient-to-br from-[#8C6339] via-[#C9AF86] to-[#FFEBBC]">
        <div className="flex flex-col gap-3">
          <div className=" text-3xl font-semibold ">
            Chế độ Auto {"(Uy tín)"}
          </div>
          <Input
            type="number"
            label="% Cược"
            variant="bordered"
            value={percent.toString()}
            onValueChange={(v) => setPercent(parseFloat(v))}
            className="max-w-xs"
            endContent={"%"}
          />
          <Input
            type="number"
            label="Số tiền cược"
            variant="bordered"
            value={coin.toString()}
            onValueChange={(v) => setCoin(parseFloat(v))}
            className="max-w-xs"
            endContent={"VND"}
          />
          <Input
            type="number"
            label="Số trận"
            variant="bordered"
            value={sotran.toString()}
            onValueChange={(v) => setSoTran(parseFloat(v))}
            className="max-w-xs"
          />
          <Select
            defaultSelectedKeys={["2"]}
            label="Chế độ chơi"
            className="max-w-xs"
          >
            {modes.map((item, index) => (
              <SelectItem
                onClick={() => setMode(item.key)}
                className=" text-[#E4BE4B]"
                key={item.key}
                value={item.value}
              >
                {item.value}
              </SelectItem>
            ))}
          </Select>
          <Button
            onPress={handleAuto}
            className=" bg-gradient-to-br from-[#8C6339] via-[#C9AF86] to-[#8C6339]"
          >
            Auto
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
function formatNumberWithCommas(number: number): string {
  return Math.round(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const play = () => {
  const xx1 = Math.floor(Math.random() * 6) + 1;
  const xx2 = Math.floor(Math.random() * 6) + 1;
  const xx3 = Math.floor(Math.random() * 6) + 1;
  return xx1 + xx2 + xx3;
};

export default TaiXiu;
