import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

const scheduleFormSchema = z.object({
  videoId: z.string().min(1, "Please select a video"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleItem {
  id: number;
  videoId: number;
  title: string;
  scheduledFor: Date;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", 
  "17:00", "18:00", "19:00", "20:00"
];

const ScheduleCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 3, 5)); // Note: month is 0-indexed, so 3 = April
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  const { data: scheduledItems = [] } = useQuery<ScheduleItem[]>({
    queryKey: ['/api/schedule'],
    // If your API doesn't have a /schedule endpoint yet, comment this out 
    // and use the mock data below
  });

  // Uncomment if you need mock data for development
  /*
  const scheduledItems: ScheduleItem[] = [
    {
      id: 1,
      videoId: 1,
      title: "Sample Video 1",
      scheduledFor: new Date(new Date().setDate(new Date().getDate() + 1))
    },
    {
      id: 2,
      videoId: 2,
      title: "Sample Video 2",
      scheduledFor: new Date(new Date().setDate(new Date().getDate() + 3))
    }
  ];
  */

  const scheduleVideoMutation = useMutation({
    mutationFn: async (data: ScheduleFormValues) => {
      // Convert form data to API format
      const scheduledDateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);

      const payload = {
        videoId: parseInt(data.videoId),
        scheduledFor: scheduledDateTime.toISOString()
      };

      const res = await apiRequest('POST', '/api/schedule', payload);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video scheduled successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      setShowScheduleDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule video",
        variant: "destructive",
      });
    },
  });

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      videoId: "",
      time: "12:00",
    },
  });

  const onSubmit = (data: ScheduleFormValues) => {
    scheduleVideoMutation.mutate(data);
  };

  const getScheduledVideo = (day: Date, time: string) => {
    return scheduledItems.find(item => {
      const itemDate = new Date(item.scheduledFor);
      return (
        itemDate.getDate() === day.getDate() &&
        itemDate.getMonth() === day.getMonth() &&
        itemDate.getFullYear() === day.getFullYear() &&
        itemDate.getHours() === parseInt(time.split(':')[0])
      );
    });
  };

  const handleScheduleClick = (day: Date, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    form.setValue('date', day);
    form.setValue('time', time);
    setShowScheduleDialog(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Content Schedule</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-0 overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={new Date(2025, 3, 5)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {date ? date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {date ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map((time) => {
                  const scheduledVideo = getScheduledVideo(date, time);
                  return (
                    <div 
                      key={time} 
                      className={`p-4 rounded-lg border ${scheduledVideo ? 'bg-primary/10 border-primary' : 'hover:bg-neutral-50 cursor-pointer'}`}
                      onClick={() => !scheduledVideo && handleScheduleClick(date, time)}
                    >
                      <div className="font-medium">{time}</div>
                      {scheduledVideo ? (
                        <div className="mt-2">
                          <div className="text-sm font-semibold">{scheduledVideo.title}</div>
                          <div className="text-xs text-neutral-500">Scheduled</div>
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-500 mt-2">Available</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                Please select a date to view and schedule content
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Content</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="videoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a video" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {videos.length > 0 ? (
                          videos.map((video) => (
                            <SelectItem key={video.id} value={video.id.toString()}>
                              {video.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-videos" disabled>
                            No videos available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        value={selectedDay ? selectedDay.toLocaleDateString() : ''} 
                        disabled 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={selectedTime || field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowScheduleDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={scheduleVideoMutation.isPending}
                >
                  {scheduleVideoMutation.isPending ? "Scheduling..." : "Schedule"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleCalendar;